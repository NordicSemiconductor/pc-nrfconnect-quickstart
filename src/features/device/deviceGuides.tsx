/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { deviceInfo } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDevice } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import path from 'path';

export interface Link {
    label: string;
    href: string;
}

export interface Firmware {
    core: 'Modem' | 'Application';
    file: string;
    link: Link;
}

interface EvaluationContent {
    links?: Link[];
    description: string;
}

export interface AppEvaluationResource extends EvaluationContent {
    app: string;
}

export interface ExternalLinkEvaluationResource extends EvaluationContent {
    title: string;
    link: Link;
}

export type EvaluationResource =
    | AppEvaluationResource
    | ExternalLinkEvaluationResource;

export interface Choice {
    name: string;
    description: string;
    firmware: Firmware[];
    documentation?: Link;
    evaluationResources: EvaluationResource[];
}

export interface DeviceGuide {
    boardVersion: string;
    description: { title: string; markdownContent: string }[];
    apps: string[];
    choices: Choice[];
    learningResources: {
        label: string;
        description: string;
        link: Link;
    }[];
}

export const getFirmwareFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'firmware');

const deviceGuides: DeviceGuide[] = [
    {
        boardVersion: 'pca10090',
        apps: [
            'pc-nrfconnect-cellularmonitor',
            'pc-nrfconnect-serial-terminal',
            'pc-nrfconnect-programmer',
            'pc-nrfconnect-ppk',
        ],
        description: [
            {
                title: 'Cellular Powerhouse',
                markdownContent: `The nRF9160 Development Kit is perfect for evaluating the nRF9160 SiP and developing cellular IoT applications.${'  \n&nbsp;  '}
It includes a Segger J-Link OB Debugger and all the necessary external circuitry like (e)SIM interface, antenna, access to all IO pins, and relevant module interfaces.${'  \n&nbsp;  '}
[Hardware documentation](https://docs.nordicsemi.com/bundle/ug_nrf91_dk/page/UG/nrf91_DK/intro.html)`,
            },
            {
                title: 'Two cores. Best friends.',
                markdownContent: `Use the modem as a companion chip with your existing code, or use the application core and eliminate the need for an external MCU.${'  \n&nbsp;  '}
The choice is yours.`,
            },
        ],
        learningResources: [
            {
                label: 'Developer Academy',
                description:
                    'Interactive online learning platform for Nordic devices.',
                link: {
                    label: 'Nordic Developer Academy',
                    href: 'https://academy.nordicsemi.com/',
                },
            },
            {
                label: 'Best practices',
                description:
                    'The main aspects and decisions you need to consider before and during your development phase of a low-power cellular Internet of Things product.',
                link: {
                    label: 'nWP044 - Best practices for IoT development',
                    href: 'https://docs.nordicsemi.com/bundle/nwp_044/page/WP/nwp_044/intro.html',
                },
            },
        ],
        choices: [
            {
                name: 'AT Commands',
                description: 'Evaluate the cellular modem using AT commands.',
                documentation: {
                    label: 'Serial LTE Modem',
                    href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/README.html',
                },
                firmware: [
                    {
                        core: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: {
                            label: 'Firmware 1.3.5',
                            href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/dev-kits/nrf9160-dk/release_notes_modemfirmware/mfw_nrf9160_1.3.5_release_notes.txt',
                        },
                    },
                    {
                        core: 'Application',
                        file: 'slm-with-trace.hex',
                        link: {
                            label: 'Serial LTE Modem',
                            href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/README.html',
                        },
                    },
                ],
                evaluationResources: [
                    {
                        title: 'Activate SIM card',
                        description:
                            'iBasis SIM cards must be activated in the nRF Cloud before use.',
                        link: { label: 'Actvate SIM card', href: '' },
                    },
                    {
                        app: 'pc-nrfconnect-serial-terminal',
                        description:
                            'Use the Serial Terminal PC application as a serial interface to send AT commands to the device',
                        links: [
                            {
                                label: 'AT Commands reference manual',
                                href: 'https://infocenter.nordicsemi.com/index.jsp?topic=%2Fref_at_commands%2FREF%2Fat_commands%2Fintro.html',
                            },
                            {
                                label: 'IP AT Commands Documentation',
                                href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/doc/AT_commands_intro.html',
                            },
                        ],
                    },
                    {
                        app: 'pc-nrfconnect-cellularmonitor',
                        description:
                            'Automatically connect and evaluate parameters',
                        links: [
                            {
                                label: 'Cellular Fundamentals',
                                href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Cloud Connectivity',
                description:
                    'Evaluate cloud interaction, location services, GNSS and real-time configurations.',
                documentation: {
                    label: 'Asset Tracker V2',
                    href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html',
                },
                firmware: [
                    {
                        core: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: {
                            label: 'Firmware 1.3.5',
                            href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/dev-kits/nrf9160-dk/release_notes_modemfirmware/mfw_nrf9160_1.3.5_release_notes.txt',
                        },
                    },
                    {
                        core: 'Application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02_8f26142b.hex',
                        link: {
                            label: 'Asset Tracker V2',
                            href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html',
                        },
                    },
                ],
                evaluationResources: [
                    {
                        title: 'Activate SIM card',
                        description:
                            'iBasis SIM cards must be activated in the nRF Cloud before use.',
                        link: { label: 'Actvate SIM card', href: '' },
                    },
                    {
                        title: 'Cellular IoT Fundamentals',
                        link: {
                            label: 'Open course',
                            href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/lessons/lesson-1-cellular-fundamentals/topic/lesson-1-exercise-1/',
                        },
                        description:
                            'Follow Exersice 1 in the Cellular IoT Fundamentals couse to evaluate cloud connectivity.',
                    },
                ],
            },
            {
                name: 'Shell Command Line Interface',
                description: 'Evaluate throughput, connectivity and more.',
                documentation: {
                    label: 'Modem Shell',
                    href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/cellular/modem_shell/README.html',
                },
                firmware: [
                    {
                        core: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: {
                            label: 'Firmware 1.3.5',
                            href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/dev-kits/nrf9160-dk/release_notes_modemfirmware/mfw_nrf9160_1.3.5_release_notes.txt',
                        },
                    },
                    {
                        core: 'Application',
                        file: 'nrf9160dk_modem_shell_with_trace_ncs_v2_3_0_2023_05_04.hex',
                        link: {
                            label: 'Modem Shell',
                            href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/cellular/modem_shell/README.html',
                        },
                    },
                ],
                evaluationResources: [
                    {
                        title: 'Activate SIM card',
                        description:
                            'iBasis SIM cards must be activated in the nRF Cloud before use.',
                        link: { label: 'Actvate SIM card', href: '' },
                    },
                    {
                        app: 'pc-nrfconnect-serial-terminal',
                        description:
                            'Serial interface to send commands to the device.',
                        links: [
                            {
                                label: 'Modem Shell documentation',
                                href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/cellular/modem_shell/README.html',
                            },
                        ],
                    },
                    {
                        app: 'pc-nrfconnect-cellularmonitor',
                        description:
                            'Automatically connect and evaluate parameters',
                        links: [
                            {
                                label: 'Cellular Fundamentals',
                                href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const isSupportedDevice = (device: NrfutilDevice) =>
    deviceGuides
        .map(d => d.boardVersion.toLowerCase())
        .includes(device.jlink?.boardVersion?.toLowerCase() || '');

const getDeviceGuide = (device: NrfutilDevice) =>
    deviceGuides.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.jlink?.boardVersion?.toLowerCase()
    );

export const deviceName = (device: NrfutilDevice) => deviceInfo(device).name;

export const deviceDescription = (device: NrfutilDevice) =>
    getDeviceGuide(device)?.description || [];

export const DeviceIcon = ({
    device,
    className = '',
}: {
    device: NrfutilDevice;
    className?: string;
}) => {
    const Icon = deviceInfo(device).icon;
    return Icon ? <Icon className={className} /> : null;
};

export const deviceApps = (device: NrfutilDevice) =>
    getDeviceGuide(device)?.apps ?? [];

export const deviceChoices = (device: NrfutilDevice) =>
    getDeviceGuide(device)?.choices ?? [];

export const deviceLearningResources = (device: NrfutilDevice) =>
    getDeviceGuide(device)?.learningResources ?? [];
