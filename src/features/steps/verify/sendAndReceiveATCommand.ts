/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    createSerialPort,
    SerialPort,
    ShellParser,
    shellParser,
    xTerminalShellParserWrapper,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { Terminal } from 'xterm-headless';

const sendCommandShellMode = (parser: ShellParser, command: string) =>
    new Promise<string>((resolve, reject) => {
        parser.enqueueRequest(`at ${command}`, {
            onSuccess: res => {
                resolve(res);
            },
            onError: err => {
                reject(err);
            },
            onTimeout: () => {
                reject(new Error('timeout'));
            },
        });
    });
const decoder = new TextDecoder();
const sendCommandLineMode = (serialPort: SerialPort, command: string) =>
    new Promise<string>((resolve, reject) => {
        let response = '';
        const handler = serialPort.onData(data => {
            response += decoder.decode(data);
            const isCompleteResponse =
                response.includes('OK') || response.includes('ERROR');
            if (isCompleteResponse) {
                handler();
                if (response.includes('ERROR')) {
                    reject(response);
                }
                if (response.includes('OK')) {
                    resolve(response);
                }
            }
        });

        serialPort.write(`${command}\r\n`);
    });

const testIfShellMode = async (serialPort: SerialPort) => {
    try {
        await sendCommandLineMode(serialPort, 'at AT');
        return true;
    } catch (error) {
        return false;
    }
};

const checkSendATCommand = async (
    path: string,
    cmd: string,
    expectedReply: string
) => {
    let createdSerialPort: SerialPort;
    try {
        createdSerialPort = await createSerialPort(
            {
                path,
                baudRate: 115200,
            },
            { overwrite: true, settingsLocked: true }
        );
    } catch (e) {
        return false;
    }

    /*
         Some applications that run Line Mode have an issue, where if you power-cycle the device,
         the first AT command after the power-cycle will return an ERROR. This function `testIfShellMode`
         makes us avoid this issue, because we emit a command that will return OK if it's in shell mode, and
         ERROR if it's in line mode. Since we already got the ERROR, we won't unexpectedly get it again
         the next time we send a command.
         */
    const isShellMode = await Promise.race([
        testIfShellMode(createdSerialPort),
        new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        }),
    ]);
    // If race times out, then we assume AT Host is not detected on device.
    const detectedAtHostLibrary = isShellMode !== undefined;

    let reply;
    if (detectedAtHostLibrary) {
        if (isShellMode) {
            const sp = await shellParser(
                createdSerialPort,
                xTerminalShellParserWrapper(
                    new Terminal({
                        allowProposedApi: true,
                        cols: 999,
                    })
                ),
                {
                    logRegex:
                        /[[][0-9]{2,}:[0-9]{2}:[0-9]{2}.[0-9]{3},[0-9]{3}] <([^<^>]+)> ([^:]+): .*(\r\n|\r|\n)$/,
                    errorRegex: /ERROR/,
                    timeout: 1000,
                    columnWidth: 80,
                }
            );

            try {
                reply = await sendCommandShellMode(sp, cmd);
            } catch (e) {
                sp.unregister();
                createdSerialPort.close();
                return false;
            }
            sp.unregister();
        } else {
            try {
                reply = await sendCommandLineMode(createdSerialPort, cmd);
            } catch (e) {
                return false;
            }
        }
        createdSerialPort.close();

        return reply.includes(expectedReply);
    }

    return false;
};

export const verifyDevice = async (
    paths: string[],
    command: string,
    expectedReply: string
) => {
    let path = paths.pop();
    while (path) {
        // eslint-disable-next-line no-await-in-loop
        const result = await checkSendATCommand(path, command, expectedReply);
        if (result) return result;
        path = paths.pop();
    }

    return false;
};
