/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// @ts-expect-error svg imports are fine
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Logo91 from '!!@svgr!../../resources/nRF91-Series-logo.svg';

const shared = {
    apps: ['pc-nrfconnect-toolchain-manager'],
    links: [
        { label: 'Nordic Academy - Cellular IoT Fundamentals', href: '' },
        { label: 'Nordic Academy - nRF Connect SDK Fundamentals', href: '' },
        { label: 'Infocenter - \\\\Device// Hardware Details', href: '' },
    ],
};

const devices = [
    {
        device: 'nRF9161 DK',
        logo: Logo91,
        apps: [
            'pc-nrfconnect-cellularmonitor',
            'pc-nrfconnect-serial-terminal',
            'pc-nrfconnect-programmer',
        ],
        links: [],
        choices: [
            {
                name: 'Serial LTE Monitor',
                description:
                    'Use this application if you want to evaluate the cellular modem using an external MCU.',
                firmware: [
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02-8f26142b.hex',
                    },
                    {
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                ],
                app: 'pc-nrfconnect-cellularmonitor',
            },
            {
                name: 'Asset Tracker V2',
                description:
                    'Use this application if you want to evaluate interactions with the cloud.',
                firmware: [
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02-8f26142b.hex',
                    },
                    {
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                ],
                app: 'pc-nrfconnect-cellularmonitor',
            },
            {
                name: 'Modem Shell',
                description:
                    'Use this application if you want to evaluate various device connectivity features such as data throughput.',
                firmware: [
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02-8f26142b.hex',
                    },
                    {
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                ],
                app: 'pc-nrfconnect-cellularmonitor',
            },
        ],
    },
];

interface EvaluationChoice {
    name: string;
    description: string;
    firmware: { format: 'modem' | 'application'; file: string }[];
    app: string;
}

let choice: EvaluationChoice | undefined;
export const setEvaluationChoice = (evaluationChoice: EvaluationChoice) => {
    choice = evaluationChoice;
};
export const getEvaluationChoice = () => choice;

export const deviceLogo = (device: string) =>
    devices.find(({ device: d }) => d === device)?.logo;

export const deviceApps = (device: string) => [
    ...(devices.find(({ device: d }) => d === device)?.apps ?? []),
    ...shared.apps,
];

export const deviceLinks = (device: string) =>
    [
        ...(devices.find(({ device: d }) => d === device)?.links ?? []),
        ...shared.links,
    ] as { label: string; href: string }[];

export const deviceEvaluationChoices = (device: string) =>
    devices.find(({ device: d }) => d === device)?.choices ?? [];
