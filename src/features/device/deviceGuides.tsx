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

interface ResourceContent {
    links?: Link[];
    description: string;
}

export interface AppResource extends ResourceContent {
    app: string;
}

export interface ExternalLinkResource extends ResourceContent {
    title: string;
    link: Link;
}

export type Resource = AppResource | ExternalLinkResource;

export interface InfoStep {
    title: string;
    markdownContent: string;
}

export interface Firmware {
    core: 'Modem' | 'Application';
    file: string;
    link: Link;
}

export interface Choice {
    name: string;
    type: 'jlink';
    description: string;
    firmware: Firmware[];
    documentation?: Link;
}

export interface ProgramStep {
    choices: Choice[];
}

export interface ATCommand {
    title: string;
    command: string;
    responseRegex: string;
    copiable: boolean;
}

export interface VerifyStep {
    type: 'AT';
    commands: ATCommand[];
}

export interface EvaluateStep {
    resourcesPerChoice: {
        ref: string;
        resources: Resource[];
    }[];
}

export interface LearnStep {
    resources: {
        label: string;
        description: string;
        link: Link;
    }[];
}

export interface AppsStep {
    apps: string[];
}

export type OptionalStepKey =
    | 'Info'
    | 'Rename'
    | 'Program'
    | 'Verify'
    | 'Evaluate'
    | 'Develop'
    | 'Learn'
    | 'Apps'
    | 'Finish'
    | 'SIM Card';

export interface DeviceGuide {
    boardVersion: string;
    stepOrder: OptionalStepKey[];
    info: InfoStep;
    program: ProgramStep;
    verify: VerifyStep;
    evaluate: EvaluateStep;
    learn: LearnStep;
    apps: AppsStep;
}

export const getFirmwareFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'devices', 'firmware');

export const getImageFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'devices', 'images');

const deviceGuides: DeviceGuide[] = [
    pca10090 as DeviceGuide,
    pca10153 as DeviceGuide,
];

export const isSupportedDevice = (device: NrfutilDevice) =>
    deviceGuides
        .map(d => d.boardVersion.toLowerCase())
        .includes(device.jlink?.boardVersion?.toLowerCase() || '');

const getDeviceGuideUnsafely = (device: NrfutilDevice) =>
    deviceGuides.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.jlink?.boardVersion?.toLowerCase()
    ) as DeviceGuide;

export const getStepOrder = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).stepOrder;
export const getInfoStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).info;
export const getLearnStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).learn;
export const getAppsStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).apps;
export const getProgramStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).program;
export const getVerifyStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).verify;
export const getEvaluateStep = (device: NrfutilDevice) =>
    getDeviceGuideUnsafely(device).evaluate;

export const deviceName = (device: NrfutilDevice) => deviceInfo(device).name;

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
