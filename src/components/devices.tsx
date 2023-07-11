/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// @ts-expect-error svg imports are fine
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Logo91 from '!!@svgr!../../resources/nRF91-Series-logo.svg';

const devices = [
    {
        device: 'nRF9161 DK',
        logo: Logo91,
        apps: [
            'pc-nrfconnect-cellularmonitor',
            'pc-nrfconnect-serial-terminal',
            'pc-nrfconnect-programmer',
        ],
        firmware: [
            {
                name: 'Serial LTE Monitor',
                description:
                    'Use this application if you want to evaluate the cellular modem using an external MCU.',
                file: '',
            },
            {
                name: 'Asset Tracker V2',
                description:
                    'Use this pplication if you want to evaluate interactions with the cloud.',
                file: '',
            },
            {
                name: 'Modem Shell',
                description:
                    'Use this application if you want to evaluate various device connectivity features such as data throughput.',
                file: '',
            },
        ],
    },
];

export const deviceLogo = (device: string) =>
    devices.find(({ device: d }) => d === device)?.logo;

export const deviceApps = (device: string) =>
    devices.find(({ device: d }) => d === device)?.apps ?? [];

export const deviceFirmware = (device: string) =>
    devices.find(({ device: d }) => d === device)?.firmware ?? [];
