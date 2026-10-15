// Reads the device flows (src/features/flows/index.tsx) to find which firmware
// each sample programs and which regex its Verify step expects on the UART.
// Then extracts the strings from those .hex files and prints only the ones the
// Verify regex would match, so it's easy to see if the firmware and the config
// still agree. Exits with code 1 if any expected line is missing, so it can run
// as a CI check (.github/workflows/check-firmware-strings.yml).
//
// Usage: npx tsx parse-hex-files.ts [filter]
//   filter - optional, only samples whose device, name or file contains it

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const FLOWS_INDEX = path.join(
    __dirname,
    'src',
    'features',
    'flows',
    'index.tsx',
);
const FIRMWARE_DIR = path.join(__dirname, 'resources', 'devices', 'firmware');

// ---------------------------------------------------------------- configs

interface Sample {
    device: string;
    name: string;
    files: string[];
    regex: RegExp;
}

const parseSource = (file: string) =>
    ts.createSourceFile(
        file,
        fs.readFileSync(file, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
    );

const resolveModule = (from: string, specifier: string) =>
    ['.ts', '.tsx', '/index.ts', '/index.tsx']
        .map(ext => path.resolve(path.dirname(from), specifier) + ext)
        .find(f => fs.existsSync(f));

const topLevelConsts = (source: ts.SourceFile) => {
    const consts = new Map<string, ts.Expression>();
    source.statements.filter(ts.isVariableStatement).forEach(statement =>
        statement.declarationList.declarations.forEach(decl => {
            if (ts.isIdentifier(decl.name) && decl.initializer)
                consts.set(decl.name.text, decl.initializer);
        }),
    );
    return consts;
};

// Turns a literal config expression (objects, arrays, strings, regexes, ...)
// into a JS value. Identifiers are looked up in the file's top-level consts,
// anything else (function calls, imports, ...) becomes undefined.
const evaluate = (
    node: ts.Expression,
    consts: Map<string, ts.Expression>,
): unknown => {
    if (
        ts.isParenthesizedExpression(node) ||
        ts.isAsExpression(node) ||
        ts.isSatisfiesExpression(node) ||
        ts.isTypeAssertionExpression(node)
    )
        return evaluate(node.expression, consts);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
        return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isRegularExpressionLiteral(node)) {
        const end = node.text.lastIndexOf('/');
        return new RegExp(node.text.slice(1, end), node.text.slice(end + 1));
    }
    if (ts.isIdentifier(node)) {
        const value = consts.get(node.text);
        return value ? evaluate(value, consts) : undefined;
    }
    if (ts.isArrayLiteralExpression(node))
        return node.elements.flatMap(el =>
            ts.isSpreadElement(el)
                ? ((evaluate(el.expression, consts) as unknown[]) ?? [])
                : [evaluate(el, consts)],
        );
    if (ts.isObjectLiteralExpression(node)) {
        const obj: Record<string, unknown> = {};
        node.properties.forEach(prop => {
            if (
                ts.isPropertyAssignment(prop) &&
                !ts.isComputedPropertyName(prop.name)
            )
                obj[prop.name.text] = evaluate(prop.initializer, consts);
            else if (ts.isShorthandPropertyAssignment(prop))
                obj[prop.name.text] = evaluate(prop.name, consts);
            else if (ts.isSpreadAssignment(prop))
                Object.assign(obj, evaluate(prop.expression, consts));
        });
        return obj;
    }
    return undefined;
};

interface ProgramChoice {
    name: string;
    programmingOptions?: { firmwareList?: { file: string }[] };
}

interface VerifyEntry {
    ref: string;
    config?: { regex?: RegExp };
}

// Reads one flow file, e.g. src/features/flows/nRF52/index.ts
const samplesOfFlow = (file: string): Sample[] => {
    const source = parseSource(file);
    const consts = topLevelConsts(source);

    const exported = source.statements.find(ts.isExportAssignment)?.expression;
    if (!exported || !ts.isObjectLiteralExpression(exported)) return [];

    const property = (name: string) =>
        exported.properties
            .filter(ts.isPropertyAssignment)
            .find(p => ts.isIdentifier(p.name) && p.name.text === name)
            ?.initializer;

    const deviceNode = property('device');
    const flowNode = property('flow');
    const device = deviceNode ? evaluate(deviceNode, consts) : undefined;
    if (
        typeof device !== 'string' ||
        !flowNode ||
        !ts.isArrayLiteralExpression(flowNode)
    )
        return [];

    // config passed to a step in the flow, e.g. Program(programConfig)
    const stepConfig = (step: string) => {
        const call = flowNode.elements.find(
            el =>
                ts.isCallExpression(el) &&
                ts.isIdentifier(el.expression) &&
                el.expression.text === step,
        ) as ts.CallExpression | undefined;
        return call?.arguments[0]
            ? evaluate(call.arguments[0], consts)
            : undefined;
    };

    const program = stepConfig('Program');
    const verify = stepConfig('Verify');
    // 91 family verifies with AT commands (an object, not a list of regexes)
    if (!Array.isArray(program) || !Array.isArray(verify)) return [];

    return (verify as VerifyEntry[]).flatMap(({ ref, config }) => {
        const choice = (program as ProgramChoice[]).find(c => c.name === ref);
        if (!config?.regex || !choice) return [];
        return [
            {
                device,
                name: ref,
                files: (choice.programmingOptions?.firmwareList ?? []).map(
                    f => f.file,
                ),
                regex: config.regex,
            },
        ];
    });
};

// Follows the flows imported by the root config
const readSamples = () => {
    const root = parseSource(FLOWS_INDEX);
    const exported = root.statements.find(ts.isExportAssignment)?.expression;

    const usedIdentifiers = new Set<string>();
    const collect = (node: ts.Node) => {
        if (ts.isIdentifier(node)) usedIdentifiers.add(node.text);
        node.forEachChild(collect);
    };
    if (exported) collect(exported);

    return root.statements.filter(ts.isImportDeclaration).flatMap(imp => {
        const name = imp.importClause?.name?.text;
        const specifier = (imp.moduleSpecifier as ts.StringLiteral).text;
        if (!name || !usedIdentifiers.has(name) || !specifier.startsWith('.'))
            return [];
        const file = resolveModule(FLOWS_INDEX, specifier);
        return file ? samplesOfFlow(file) : [];
    });
};

// ---------------------------------------------------------------- hex files

function parseIntelHex(text: string) {
    const mem = new Map<number, number>(); // absolute address -> byte
    let base = 0;

    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;
        if (line[0] !== ':') throw new Error(`Bad record: ${line}`);

        const rec = Buffer.from(line.slice(1), 'hex');
        const len = rec[0];
        const addr = (rec[1] << 8) | rec[2];
        const type = rec[3];
        const data = rec.subarray(4, 4 + len);

        // all bytes of a record (incl. checksum) must sum to 0 mod 256
        if (rec.reduce((a, b) => (a + b) & 0xff, 0) !== 0)
            throw new Error(`Checksum error: ${line}`);

        switch (type) {
            case 0x00:
                data.forEach((b, i) => mem.set(base + addr + i, b));
                break;
            case 0x01:
                return mem; // end of file
            case 0x02:
                base = ((data[0] << 8) | data[1]) * 16;
                break; // ext. segment address
            case 0x04:
                base = ((data[0] << 8) | data[1]) * 65536;
                break; // ext. linear address
            // 0x03 / 0x05 = start address, not needed here
        }
    }
    return mem;
}

// Group bytes into contiguous regions: [{ start, bytes: Buffer }, ...]
function toRegions(mem: Map<number, number>) {
    const addrs = [...mem.keys()].sort((a, b) => a - b);
    const regions: { start: number; arr: number[] }[] = [];
    let cur: { start: number; arr: number[] } | null = null;
    for (const a of addrs) {
        if (!cur || a !== cur.start + cur.arr.length) {
            cur = { start: a, arr: [] };
            regions.push(cur);
        }
        cur.arr.push(mem.get(a) as number);
    }
    return regions.map(r => ({ start: r.start, bytes: Buffer.from(r.arr) }));
}

const isPrintable = (b: number) =>
    (b >= 0x20 && b <= 0x7e) || b === 0x09 || b === 0x0a || b === 0x0d;

// Pull out NUL-terminated runs of printable ASCII (C strings)
function extractStrings(regions: { bytes: Buffer }[]) {
    const out: string[] = [];
    for (const { bytes } of regions) {
        let s = '';
        for (let i = 0; i <= bytes.length; i++) {
            const b = bytes[i];
            if (isPrintable(b)) {
                s += String.fromCharCode(b);
            } else {
                if (b === 0 && s.trim()) out.push(s.trim());
                s = '';
            }
        }
    }
    return out;
}

// ---------------------------------------------------------------- matching

// The Verify regexes match several UART lines at once, e.g.
// /(\*{3} Booting ... \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nHello World!)/
// Split them into one regex per line, so each can be tested against a string.
function regexLines(regex: RegExp) {
    let source = regex.source;

    // drop the capture group around the whole regex
    let depth = 0;
    const wrapped =
        source.startsWith('(') &&
        source.endsWith(')') &&
        [...source].every((c, i) => {
            if (source[i - 1] === '\\') return true;
            if (c === '(') depth += 1;
            if (c === ')') depth -= 1;
            return depth > 0 || i === source.length - 1;
        });
    if (wrapped) source = source.slice(1, -1);

    // like the app, don't anchor where the regex itself doesn't: the first line
    // may have a prefix and the last line may continue (e.g. ".../cpuapp")
    const lines = source.split(/\\r\\n|\\n/).filter(Boolean);
    return lines.map((line, i) => ({
        source: line,
        regex: new RegExp(
            `${i > 0 ? '^' : ''}(?:${line})${i < lines.length - 1 ? '$' : ''}`,
            regex.flags,
        ),
    }));
}

const FORMAT_SPECIFIER =
    /%[-+ #0]*(\d+|\*)?(\.\d+)?(hh|h|ll|l|z|j|t)?[diouxXcsp]/g;
const TOKEN = /^[\w./@+-]+$/; // board names, versions, ...

// What a printf format string could print: numbers become 0, and %s is
// replaced by every token-like string of the same firmware.
function expand(format: string, tokens: string[]) {
    const withNumbers = format.replace(FORMAT_SPECIFIER, m =>
        m.endsWith('s') ? '%s' : '0',
    );
    if (!withNumbers.includes('%s')) return [withNumbers];
    return tokens.map(token => withNumbers.split('%s').join(token));
}

const escape = (s: string) =>
    s.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t');

// ---------------------------------------------------------------- main

const filter = (process.argv[2] ?? '').toLowerCase();
const samples = readSamples().filter(s =>
    [s.device, s.name, ...s.files].some(t => t.toLowerCase().includes(filter)),
);

const git = (...args: string[]) => {
    try {
        return execFileSync('git', args, {
            cwd: __dirname,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    } catch {
        return undefined; // no git or not a git repository
    }
};

// A shallow clone (e.g. actions/checkout without fetch-depth: 0) has only the
// latest commit, so every file would get that commit's date. Show no date
// rather than a wrong one.
const shallow = git('rev-parse', '--is-shallow-repository');
if (shallow !== 'false')
    console.warn(
        shallow === 'true'
            ? 'Shallow git clone, commit dates are unknown. Run `git fetch --unshallow` to get them.\n'
            : 'No git repository found, commit dates are unknown.\n',
    );

// Date of the last commit that changed the firmware file, e.g. "2024-10-24"
const commitDate = (file: string) => {
    if (shallow !== 'false') return 'date unknown';
    const fullPath = path.join(FIRMWARE_DIR, file);
    const date = git('log', '-1', '--format=%cs', '--', fullPath);
    if (!date) return 'not committed';
    const changed = git('status', '--porcelain', '--', fullPath);
    return changed ? `${date}, changed since` : date;
};

const problems: string[] = [];
if (samples.length === 0 && !filter)
    problems.push(`No samples with a Verify regex found in ${FLOWS_INDEX}`);

samples.forEach((sample, i) => {
    if (i > 0) console.log('---------');
    const files = sample.files.map(f => `${f} [${commitDate(f)}]`);
    console.log(`${sample.device} - ${sample.name} (${files.join(', ')})`);
    console.log();

    const strings = new Set<string>();
    sample.files.forEach(file => {
        const fullPath = path.join(FIRMWARE_DIR, file);
        if (!file.endsWith('.hex') || !fs.existsSync(fullPath)) {
            console.log(
                `MISSING FILE: ${file} (not a .hex file in ${FIRMWARE_DIR})`,
            );
            problems.push(`${sample.device} - ${sample.name}: missing ${file}`);
            return;
        }
        const text = fs.readFileSync(fullPath, 'utf8');
        extractStrings(toRegions(parseIntelHex(text))).forEach(s =>
            strings.add(s),
        );
    });

    const all = [...strings];
    const tokens = all.filter(s => TOKEN.test(s));
    const formats = all.filter(s => s.search(FORMAT_SPECIFIER) !== -1);

    regexLines(sample.regex).forEach(line => {
        let matches = all.filter(s => line.regex.test(s));
        if (matches.length === 0)
            matches = formats
                .flatMap(f => expand(f, tokens))
                .filter(s => line.regex.test(s));

        if (matches.length === 0) {
            console.log(`NOT FOUND: /${line.source}/`);
            problems.push(
                `${sample.device} - ${sample.name}: /${line.source}/ not found`,
            );
        }
        new Set(matches).forEach(m => console.log(escape(m)));
    });
    console.log();
});

if (problems.length > 0) {
    console.error(`FAILED, ${problems.length} problem(s):`);
    problems.forEach(p => console.error(`  ${p}`));
    process.exitCode = 1;
} else {
    console.log(`OK, ${samples.length} sample(s) match their Verify regex.`);
}
