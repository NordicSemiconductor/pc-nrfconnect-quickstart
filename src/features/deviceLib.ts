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
import path from 'path';
import { getDeviceLibContext } from 'pc-nrfconnect-shared';

import type { Firmware } from './devicesGuides';

const requiredTraits: DeviceTraits = {
    jlink: true,
    serialPorts: true,
    modem: true,
};

export const watchDevices = async (
    deviceArrived: (device: Device) => void,
    deviceLeft: (deviceId: number) => void
) => {
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
                        deviceArrived(event.device);
                    }
                    break;
                case 'NRFDL_DEVICE_EVENT_LEFT':
                    deviceLeft(event.device_id);
                    break;
            }
        }
    );

    initialDevices.forEach(deviceArrived);
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
            (err: Error) => {
                if (err) console.log('err', err);
            },
            (err: Error) => console.log('doc', err),
            progressCb,
            {
                operations,
            }
        );
    } catch (error) {
        console.log('in catch', error);
    }
};
