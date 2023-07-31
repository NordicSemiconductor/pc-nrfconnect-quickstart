/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';

// @ts-expect-error svg imports are fine
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Logo91 from '!!@svgr!../../resources/nRF91-Series-logo.svg';

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
    deviceName: string;
    logo: React.ElementType;
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

const devices: DeviceGuide[] = [
    {
        boardVersion: 'pca10090',
        deviceName: 'nRF9160 DK',
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
                        format: 'modem',
                        file: 'mfw_nrf9160_1.3.4.zip',
                    },
                    {
                        format: 'application',
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02-8f26142b.hex',
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
                        file: 'nrf9160dk_asset_tracker_v2_debug_2023-03-02-8f26142b.hex',
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

const getDeviceGuide = (device: Device) =>
    devices.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.jlink?.boardVersion.toLowerCase()
    );

export const deviceName = (device: Device) =>
    getDeviceGuide(device)?.deviceName;

export const DeviceLogo = ({
    device,
    className = '',
}: {
    device: Device;
    className?: string;
}) => {
    const Logo = getDeviceGuide(device)?.logo;
    return Logo ? <Logo className={className} /> : null;
};

export const deviceApps = (device: Device) => [
    ...(getDeviceGuide(device)?.apps ?? []),
    ...shared.apps,
];

export const deviceLinks = (device: Device) =>
    [...(getDeviceGuide(device)?.links ?? []), ...shared.links] as {
        label: string;
        href: string;
    }[];

export const deviceEvaluationChoices = (device: Device) =>
    getDeviceGuide(device)?.choices ?? [];
