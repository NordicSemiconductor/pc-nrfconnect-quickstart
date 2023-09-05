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

export interface Choice {
    name: string;
    description: string;
    firmware: Firmware[];
    documentation?: Link;
    evaluationResources: { links: Link[]; app: string; description: string }[];
    links?: Link[];
}

export interface DeviceGuide {
    boardVersion: string;
    description: string;
    apps: string[];
    links: Link[];
    choices: Choice[];
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
        description:
            'The nRF9160 Development Kit is perfect for evaluating the nRF9160 SiP and developing cellular IoT applications. It includes a SEGGER J-Link OB Debugger and all the necessary external circuitry like (e)SIM interface, antenna, access to all Io pins, and relevant module interfaces.',
        links: [
            {
                label: 'Nordic Academy - Cellular IoT Fundamentals',
                href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/',
            },
        ],
        choices: [
            {
                name: 'AT Commands',
                description: 'Evaluate the cellular modem using At commands.',
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
                evaluationResources: [],
                links: [
                    {
                        label: 'Application documentation',
                        href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html',
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
                links: [
                    {
                        label: 'Application documentation',
                        href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/cellular/modem_shell/README.html',
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
    getDeviceGuide(device)?.description || '';

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

// TODO: concat deviceInfo links?
export const deviceLinks = (device: NrfutilDevice, choice?: Choice) =>
    [...(getDeviceGuide(device)?.links ?? []), ...(choice?.links ?? [])].reduce<
        Link[]
    >((links, link) => (links.includes(link) ? links : [...links, link]), []);

export const deviceChoices = (device: NrfutilDevice) =>
    getDeviceGuide(device)?.choices ?? [];
