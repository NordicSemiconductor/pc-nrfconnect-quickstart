/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    DeviceTraits,
    NrfutilDevice,
    NrfutilDeviceLib,
    NrfutilDeviceWithSerialnumber,
    Progress,
} from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import path from 'path';

import { ResetProgress } from '../steps/program/programSlice';
import { Firmware, getFirmwareFolder } from './deviceGuides';

const requiredTraits: DeviceTraits = {
    jlink: true,
    modem: true,
    nordicUsb: true,
};

const hasSerialNumber = (
    device: NrfutilDevice
): device is NrfutilDeviceWithSerialnumber =>
    'serialNumber' in device && device.serialNumber !== undefined;

export const startWatchingDevices = async (
    onDeviceArrived: (device: NrfutilDeviceWithSerialnumber) => void,
    onDeviceLeft: (deviceId: number) => void
) => {
    const stopHotplugEvents = await NrfutilDeviceLib.list(
        requiredTraits,
        initialDevices =>
            initialDevices.filter(hasSerialNumber).forEach(onDeviceArrived),
        console.log,
        {
            onDeviceArrived,
            onDeviceLeft,
        }
    );

    return () => {
        if (stopHotplugEvents.isRunning()) {
            stopHotplugEvents.stop();
        }
    };
};

export const reset = (device: NrfutilDeviceWithSerialnumber) =>
    NrfutilDeviceLib.reset(device, 'Application', 'RESET_SYSTEM');

export const program = (
    device: NrfutilDeviceWithSerialnumber,
    firmware: Firmware[],
    onProgress: (index: number, progress: Progress) => void,
    onResetProgress: (resetProgress: ResetProgress) => void
) => {
    const batch = NrfutilDeviceLib.batch();
    batch.recover('Application');
    firmware.forEach(({ file }, index) => {
        batch.program(
            path.join(getFirmwareFolder(), file),
            'Application',
            undefined,
            undefined,
            { onProgress: progress => onProgress(index, progress) }
        );
    });

    batch.reset('Application', 'RESET_SYSTEM', {
        onTaskBegin: () => {
            onResetProgress(ResetProgress.STARTED);
        },
        onTaskEnd: end => {
            if (end.result === 'success') {
                onResetProgress(ResetProgress.FINISHED);
            }
        },
    });

    return batch.run(device);
};
