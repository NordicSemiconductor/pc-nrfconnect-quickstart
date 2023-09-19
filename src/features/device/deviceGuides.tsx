/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { deviceInfo } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDevice } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import path from 'path';

import pca10090 from './pca10090.json';
import pca10153 from './pca10153.json';

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
    description: { title: string; markdownContent: string };
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
    pca10090 as DeviceGuide,
    pca10153 as DeviceGuide,
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
    getDeviceGuide(device)?.description || { title: '', markdownContent: '' };

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
