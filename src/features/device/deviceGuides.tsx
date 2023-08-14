/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { deviceInfo } from '@nordicsemiconductor/pc-nrfconnect-shared';
import path from 'path';

export interface Firmware {
    format: 'Modem' | 'Application';
    file: string;
    link: string;
}

export interface Link {
    label: string;
    href: string;
}

export interface Choice {
    name: string;
    description: string;
    firmware: Firmware[];
    app: string;
    links?: Link[];
}

export interface DeviceGuide {
    boardVersion: string;
    apps: string[];
    links: Link[];
    choices: Choice[];
}

export const getFirmwareFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'firmware');

const shared: { apps: string[]; links: Link[] } = {
    apps: ['pc-nrfconnect-toolchain-manager'],
    links: [
        { label: 'Nordic Academy - Cellular IoT Fundamentals', href: '' },
        { label: 'Nordic Academy - nRF Connect SDK Fundamentals', href: '' },
        { label: 'Infocenter - \\\\Device// Hardware Details', href: '' },
    ],
};

const deviceGuides: DeviceGuide[] = [
    {
        boardVersion: 'pca10090',
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
                        format: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: 'https://www.nordicsemi.com/Products/Development-hardware/nRF9160-DK/Download?lang=en#infotabs',
                    },
                    {
                        format: 'Application',
                        file: 'slm-with-trace.hex',
                        link: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/README.html',
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
                        format: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: 'https://www.nordicsemi.com/Products/Development-hardware/nRF9160-DK/Download?lang=en#infotabs',
                    },
                    {
                        format: 'Application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02_8f26142b.hex',
                        link: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html',
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
                        format: 'Modem',
                        file: 'mfw_nrf9160_1.3.5.zip',
                        link: 'https://www.nordicsemi.com/Products/Development-hardware/nRF9160-DK/Download?lang=en#infotabs',
                    },
                    {
                        format: 'Application',
                        file: 'nrf9160dk_modem_shell_with_trace_ncs_v2_3_0_2023_05_04.hex',
                        link: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/samples/cellular/modem_shell/README.html',
                    },
                ],
                app: 'pc-nrfconnect-cellularmonitor',
            },
        ],
    },
];

export const isSupportedDevice = (device: Device) =>
    deviceGuides
        .map(d => d.boardVersion.toLowerCase())
        .includes(device.jlink?.boardVersion?.toLowerCase() || '');

const getDeviceGuide = (device: Device) =>
    deviceGuides.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.jlink?.boardVersion?.toLowerCase()
    );

export const deviceName = (device: Device) => deviceInfo(device).name;

export const DeviceIcon = ({
    device,
    className = '',
}: {
    device: Device;
    className?: string;
}) => {
    const Icon = deviceInfo(device).icon;
    return Icon ? <Icon className={className} /> : null;
};

export const deviceApps = (device: Device, choice?: Choice) =>
    [
        ...(getDeviceGuide(device)?.apps ?? []),
        ...(choice?.app ? [choice.app] : []),
        ...shared.apps,
    ].reduce<string[]>(
        (acc, app) => (acc.includes(app) ? acc : [...acc, app]),
        []
    );

// TODO: concat deviceInfo links?
export const deviceLinks = (device: Device, choice?: Choice) =>
    [
        ...(getDeviceGuide(device)?.links ?? []),
        ...shared.links,
        ...(choice?.links ?? []),
    ].reduce<Link[]>(
        (acc, link) => (acc.includes(link) ? acc : [...acc, link]),
        []
    );

export const deviceEvaluationChoices = (device: Device) =>
    getDeviceGuide(device)?.choices ?? [];