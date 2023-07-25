/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    // @ts-expect-error no type definitions for this yet
    deviceControlExecuteOperations,
} from '@nordicsemiconductor/nrf-device-lib-js';
import path from 'path';
import { Device, getDeviceLibContext } from 'pc-nrfconnect-shared';

const labelToFormat = (label: string) => {
    switch (label) {
        case 'modem':
            return 'NRFDL_FW_NRF91_MODEM';
        case 'application':
            return 'NRFDL_FW_INTEL_HEX';
        default:
            throw new Error(`Unknown label: ${label}`);
    }
};

export const program = async (
    device: Device,
    firmware: object[],
    progressCb: (progress: unknown) => void
) => {
    const operations = [];
    operations.push(
        // @ts-expect-error no type definitions for this yet
        firmware.map(({ format, file }, index) => ({
            operationId: index,
            operation: {
                type: 'program',
                firmware: {
                    format: labelToFormat(format),
                    file: path.resolve(
                        __dirname,
                        '..',
                        'resources',
                        'firmware',
                        file
                    ),
                },
            },
        }))
    );

    operations.push({
        operation: {
            type: 'reset',
            operationId: operations.length,
            option: 'RESET_SYSTEM',
        },
    });

    try {
        await deviceControlExecuteOperations(
            getDeviceLibContext(),
            device.id,
            (err: unknown) => {
                if (err) console.log('err', err);
                else console.log('no err');
            },
            (err: unknown) => console.log('doc', err),
            progressCb,
            {
                operations,
            }
        );
    } catch (error) {
        console.log('in catch', error);
    }
};
