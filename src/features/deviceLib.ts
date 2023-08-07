/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    Device,
    // @ts-expect-error no type definitions for this yet
    deviceControlExecuteOperations,
    DeviceTraits,
    enumerate,
    Progress,
    startHotplugEvents,
    stopHotplugEvents,
} from '@nordicsemiconductor/nrf-device-lib-js';
import EventEmitter from 'events';
import path from 'path';
import { getDeviceLibContext } from 'pc-nrfconnect-shared';

import type { Firmware } from './deviceGuides';

const connectedDevices = new Map<string, Device>();
export const connectedDevicesEvents = new EventEmitter();

export const getConnectedDevices = () => [...connectedDevices.values()];
const addDevice = (device: Device) => {
    connectedDevices.set(device.serialNumber, device);
    connectedDevicesEvents.emit('update', getConnectedDevices());
};

const removeDevice = (deviceId: number) => {
    connectedDevices.forEach(device => {
        if (device.id === deviceId) {
            connectedDevices.delete(device.serialNumber);
            connectedDevicesEvents.emit('update', getConnectedDevices());
        }
    });
};

const requiredTraits: DeviceTraits = {
    jlink: true,
    modem: true,
    nordicUsb: true,
};

export const startWatchingDevices = async () => {
    const initialDevices = await enumerate(
        getDeviceLibContext() as unknown as number,
        requiredTraits
    );

    const hotplugEventsId = startHotplugEvents(
        getDeviceLibContext() as unknown as number,
        err => {
            if (err) console.log(err);
        },
        event => {
            switch (event.event_type) {
                case 'NRFDL_DEVICE_EVENT_ARRIVED':
                    if (event.device && event.device.serialNumber) {
                        addDevice(event.device);
                    }
                    break;
                case 'NRFDL_DEVICE_EVENT_LEFT':
                    removeDevice(event.device_id);
                    break;
            }
        }
    );

    initialDevices.filter(device => device.serialNumber).forEach(addDevice);
    return () => stopHotplugEvents(hotplugEventsId);
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
        ...firmware
            .filter((_, index) => index === 1)
            .map(({ format, file }, index) => ({
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
