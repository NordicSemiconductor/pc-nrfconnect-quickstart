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
import { getDeviceLibContext } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Firmware, getFirmwareFolder } from './deviceGuides';

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

const labelToFormat = (label: Firmware['format']) => {
    switch (label) {
        case 'Modem':
            return 'NRFDL_FW_NRF91_MODEM';
        case 'Application':
            return 'NRFDL_FW_INTEL_HEX';
        default:
            throw new Error(`Unknown label: ${label}`);
    }
};

export const program = async (
    device: Device,
    firmware: Firmware[],
    progressCb: (progress: Progress.CallbackParameters) => void,
    completeCb: (err?: Error) => void
) => {
    const operations = [];
    operations.push(
        ...firmware.map(({ format, file }, index) => ({
            operationId: index.toString(),
            operation: {
                type: 'program',
                firmware: {
                    format: labelToFormat(format),
                    file: path.join(getFirmwareFolder(), file),
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
        completeCb,
        () => {},
        progressCb,
        {
            operations,
        }
    );
};
