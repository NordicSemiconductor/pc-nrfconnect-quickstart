/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import fs from 'fs';
import path from 'path';

import { type Choice, findElfFile } from '../device/deviceSlice';
import { programConfig as nRF9151 } from './nRF9151';
import { programConfig as nRF9151SMA } from './nRF9151SMA';
import { programConfig as thingy91x } from './thingy91x';

const firmwareFolder = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'resources',
    'devices',
    'firmware',
);

const assetTracker = (choices: Choice[]) =>
    choices.find(choice => choice.name === 'Asset Tracker');

describe.each([
    ['nRF9151 DK', nRF9151],
    ['nRF9151 SMA DK', nRF9151SMA],
    ['Nordic Thingy:91 X', thingy91x],
])('Asset Tracker on the %s', (_, choices) => {
    it('bundles the ELF file uploaded during nRF Cloud onboarding', () => {
        const elfFile = findElfFile(assetTracker(choices));

        expect(elfFile).toBeDefined();
        expect(
            fs.existsSync(path.join(firmwareFolder, elfFile as string)),
        ).toBe(true);
    });
});
