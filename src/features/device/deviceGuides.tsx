/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { deviceInfo } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDevice } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

import pca10090 from './pca10090.json';
import pca10153 from './pca10153.json';
import pca10171 from './pca10171.json';

export const getFirmwareFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'devices', 'firmware');

export const getImageFolder = () =>
    path.resolve(__dirname, '..', 'resources', 'devices', 'images');

const ensureResourceExists = (resource: string) =>
    fs.existsSync(path.join(getImageFolder(), resource)) ||
    fs.existsSync(path.resolve(getFirmwareFolder(), resource));

const link = z.object({ label: z.string(), href: z.string().url() });
export type Link = z.infer<typeof link>;

const configurableSteps = z.union([
    z.literal('info'),
    z.literal('program'),
    z.literal('verify'),
    z.literal('evaluate'),
    z.literal('learn'),
    z.literal('apps'),
]);
type ConfigurableStep = z.infer<typeof configurableSteps>;

const nonConfigurableSteps = z.union([
    z.literal('rename'),
    z.literal('develop'),
    z.literal('sim'),
]);

const steps = z.union([configurableSteps, nonConfigurableSteps]);
export type Step = z.infer<typeof steps>;
const stepOrder = z
    .array(steps)
    .refine(
        arr =>
            arr.includes('evaluate')
                ? arr.includes('program') &&
                  arr.indexOf('program') < arr.indexOf('evaluate')
                : true,
        { message: '`Program` step must occur before `Evaluate` step.' }
    )
    .refine(arr => !arr.some((s, i) => arr.indexOf(s) !== i), {
        message: 'Duplicate steps are not allowed.',
    });

const firmware = z.object({
    core: z.union([
        z.literal('Modem'),
        z.literal('Application'),
        z.literal('Network'),
    ]),
    file: z.string().refine(f => ensureResourceExists(f)),
    link,
});

export type Firmware = z.infer<typeof firmware>;

const choice = z.object({
    name: z.string(),
    type: z.literal('jlink'),
    description: z.string(),
    documentation: link,
    firmware: z.array(firmware),
});

export type Choice = z.infer<typeof choice>;

const program = z.object({
    choices: z.array(choice),
});
const verify = z.object({
    type: z.literal('AT'),
    commands: z.array(
        z.object({
            title: z.string(),
            command: z.string(),
            responseRegex: z.string(),
            copiable: z.boolean().optional(),
        })
    ),
});
const appResource = z.object({
    app: z.string().startsWith('pc-nrfconnect-'),
    description: z.string(),
    links: z.array(link).optional(),
});
const externalLinkResource = z.object({
    title: z.string(),
    description: z.string(),
    link,
    links: z.array(link).optional(),
});

export type AppResource = z.infer<typeof appResource>;
export type ExternalLinkResource = z.infer<typeof externalLinkResource>;
export type Resource = AppResource | ExternalLinkResource;

const evaluate = z.object({
    resourcesPerChoice: z.array(
        z.object({
            ref: z.string(),
            resources: z.array(z.union([appResource, externalLinkResource])),
        })
    ),
});
const learn = z.object({
    resources: z.array(
        z.object({
            label: z.string(),
            description: z.string(),
            link,
        })
    ),
});
const apps = z.object({
    apps: z.array(z.string().startsWith('pc-nrfconnect-')),
});

const info = z.object({
    title: z.string(),
    markdownContent: z.string().refine(content => {
        const matches = content.matchAll(/\[.*\]\((.*)\)/g);
        const next = matches.next().value;
        while (next) {
            if (!ensureResourceExists(next[0])) {
                return false;
            }
        }
        return true;
    }),
});

const deviceGuideSchema = z
    .object({
        boardVersion: z.string(),
        stepOrder,
    })
    .and(
        z
            .object({
                info,
                program,
                verify,
                evaluate,
                learn,
                apps,
            })
            .partial()
    )
    .refine(o => o.boardVersion !== 'pca10090' && o.stepOrder.includes('sim'), {
        message: '`Sim` step only supported for nRF9160.',
    })
    .refine(
        o =>
            !(
                o.boardVersion !== 'pca10090' &&
                o.boardVersion !== 'pca10153' &&
                o.stepOrder.includes('verify')
            ),
        { message: '`Verify` step only supported for nRF9160 and nRF9161.' }
    )
    .refine(
        o =>
            o.stepOrder
                .filter(s => configurableSteps.safeParse(s).success)
                .every(s => Object.keys(o).includes(s) !== undefined),
        { message: 'All configurable steps must have valid configurations' }
    )
    .refine(
        o =>
            o.stepOrder.includes('evaluate')
                ? o.evaluate?.resourcesPerChoice.every(r =>
                      o.program?.choices.find(c => c.name === r.ref)
                  )
                : true,
        {
            message:
                'All `evaluate` resources must reference a `program` choice.',
        }
    );

type DeviceGuide = z.infer<typeof deviceGuideSchema>;
export type StepConfig<T extends Step> = T extends ConfigurableStep
    ? NonNullable<DeviceGuide[T]>
    : undefined;

const deviceGuides: DeviceGuide[] = [
    pca10090 as DeviceGuide,
    pca10153 as DeviceGuide,
    pca10171 as DeviceGuide,
];

export const isSupportedDevice = (device: NrfutilDevice) =>
    deviceGuides
        .map(d => d.boardVersion.toLowerCase())
        .includes(device.devkit?.boardVersion?.toLowerCase() || '');

const getDeviceGuide = (device: NrfutilDevice): DeviceGuide => {
    const deviceGuide = deviceGuides.find(
        d =>
            d.boardVersion.toLowerCase() ===
            device.devkit?.boardVersion?.toLowerCase()
    );
    if (deviceGuide === undefined) {
        throw new Error(
            `Could not find device guide for device: ${device.devkit?.boardVersion}`
        );
    }
    return deviceGuide;
};

export const getStepOrder = (device: NrfutilDevice) =>
    getDeviceGuide(device).stepOrder;
export const getStepConfiguration = <T extends ConfigurableStep>(
    step: T,
    device: NrfutilDevice
): T extends ConfigurableStep ? NonNullable<DeviceGuide[T]> : undefined => {
    const configurableStep = configurableSteps.safeParse(step);
    if (configurableStep.success) {
        const config = getDeviceGuide(device)[configurableStep.data];
        if (config === undefined) {
            throw new Error(`Could not find configuration for step: ${step}`);
        }
        // @ts-expect-error Typescript can't seem to evaluate conditionals explicitly.
        return config;
    }
    // @ts-expect-error Typescript can't seem to evaluate conditionals explicitly.
    return undefined;
};

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
