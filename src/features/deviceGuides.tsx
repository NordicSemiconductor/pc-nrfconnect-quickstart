/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { deviceInfo } from 'pc-nrfconnect-shared';

export interface Firmware {
    format: string;
    file: string;
}

export interface Choice {
    name: string;
    description: string;
    firmware: Firmware[];
    app: string;
}

export interface Link {
    label: string;
    href: string;
}

export interface DeviceGuide {
    boardVersion: string;
    apps: string[];
    links: Link[];
    choices: Choice[];
}

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
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02_8f26142b.hex',
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
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02_8f26142b.hex',
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
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02_8f26142b.hex',
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
        .includes(device.jlink?.boardVersion.toLowerCase() || '');

const getDeviceGuide = (device: Device) =>
    deviceGuides.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.jlink?.boardVersion.toLowerCase()
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

export const deviceApps = (device: Device) => [
    ...(getDeviceGuide(device)?.apps ?? []),
    ...shared.apps,
];

// TODO: concat deviceInfo links?
export const deviceLinks = (device: Device) =>
    [...(getDeviceGuide(device)?.links ?? []), ...shared.links] as {
        label: string;
        href: string;
    }[];

export const deviceEvaluationChoices = (device: Device) =>
    getDeviceGuide(device)?.choices ?? [];
