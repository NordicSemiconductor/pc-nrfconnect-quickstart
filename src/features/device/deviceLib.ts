/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    Device,
    // @ts-expect-error no type definitions for this yet
    deviceControlExecuteOperations,
    enumerate,
    Progress,
    startHotplugEvents,
    stopHotplugEvents,
} from '@nordicsemiconductor/nrf-device-lib-js';
import path from 'path';
import { getDeviceLibContext } from 'pc-nrfconnect-shared';

import type { Firmware } from './deviceGuides';

const requiredTraits = {
    jlink: true,
    modem: true,
    nordicUsb: true,
};

export const startWatchingDevices = (
    onAddedDevice: (device: Device) => void,
    onRemovedDevice: (deviceId: number) => void
) => {
    let hotplugEventsId: number | undefined;
    const context = getDeviceLibContext();

    // @ts-expect-error -- the type definition for `enumerate` is outdated, is fixed in a later version
    enumerate(context, requiredTraits).then(initialDevices => {
        initialDevices
            .filter(device => device.serialNumber)
            .forEach(onAddedDevice);

        hotplugEventsId = startHotplugEvents(
            // @ts-expect-error -- the type definition for `startHotplugEvents` is outdated, is fixed in a later version
            context,
            err => {
                if (err) console.log(err);
            },
            event => {
                switch (event.event_type) {
                    case 'NRFDL_DEVICE_EVENT_ARRIVED':
                        if (event.device && event.device.serialNumber) {
                            onAddedDevice(event.device);
                        }
                        break;
                    case 'NRFDL_DEVICE_EVENT_LEFT':
                        onRemovedDevice(event.device_id);
                        break;
                }
            }
        );
    });

    return () => {
        if (hotplugEventsId != null) {
            stopHotplugEvents(hotplugEventsId);
        }
    };
};

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
    firmware: Firmware[],
    progressCb: (progress: Progress.CallbackParameters) => void
) => {
    const operations = [];
    operations.push(
        ...firmware.map(({ format, file }, index) => ({
            operationId: index.toString(),
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
        operationId: operations.length.toString(),
        operation: {
            type: 'reset',
            option: 'RESET_SYSTEM',
        },
    });

    await deviceControlExecuteOperations(
        getDeviceLibContext(),
        device.id,
        (err?: Error) => {
            if (err) throw err;
        },
        () => {},
        progressCb,
        {
            operations,
        }
    );
};
