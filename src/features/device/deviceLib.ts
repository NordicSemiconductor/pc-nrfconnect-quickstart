/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    Device,
    deviceControlExecuteOperations,
    DeviceTraits,
    enumerate,
    Error,
    JLinkPluginOperationsArguments,
    Progress,
    startHotplugEvents,
    stopHotplugEvents,
} from '@nordicsemiconductor/nrf-device-lib-js';
import { getDeviceLibContext } from '@nordicsemiconductor/pc-nrfconnect-shared';
import path from 'path';

import { Firmware, getFirmwareFolder } from './deviceGuides';
import { DeviceWithRequiredSerialNumber } from './deviceSlice';

const requiredTraits: DeviceTraits = {
    jlink: true,
    modem: true,
    nordicUsb: true,
};

const hasSerialNumber = (
    device: Device
): device is DeviceWithRequiredSerialNumber =>
    'serialNumber' in device && device.serialNumber !== undefined;

export const startWatchingDevices = (
    onAddedDevice: (device: DeviceWithRequiredSerialNumber) => void,
    onRemovedDevice: (deviceId: number) => void
) => {
    let hotplugEventsId: bigint | undefined;
    const context = getDeviceLibContext();

    enumerate(context, requiredTraits).then(initialDevices => {
        initialDevices.filter(hasSerialNumber).forEach(onAddedDevice);

        hotplugEventsId = startHotplugEvents(
            context,
            err => {
                if (err) console.log(err);
            },
            event => {
                switch (event.event_type) {
                    case 'NRFDL_DEVICE_EVENT_ARRIVED':
                        if (event.device && hasSerialNumber(event.device)) {
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
        if (hotplugEventsId) {
            stopHotplugEvents(hotplugEventsId);
        }
    };
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
    completeCb: (error?: Error) => void
) => {
    const operations: JLinkPluginOperationsArguments[] = [];
    operations.push(
        ...firmware.map(({ format, file }, index) => ({
            operationId: index.toString(),
            operation: {
                type: 'program' as const,
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
