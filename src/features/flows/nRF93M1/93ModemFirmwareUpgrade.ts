/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { getModule } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import path from 'path';
import semver from 'semver';

import { type AppThunk } from '../../../app/store';
import sendATCommands from '../../../common/sendATCommands';
import { runNextProgrammingAction } from '../../../common/steps/Program/actionVariants/actionList';
import {
    addNote,
    setError,
    setProgrammingProgress,
    showConfirmDialog,
    skipProgrammingAction,
} from '../../../common/steps/Program/programSlice';
import { getFirmwareFolder } from '../../device/deviceGuides';
import { type DeviceWithSerialnumber } from '../../device/deviceLib';

const MINIMUM_VERSION_TO_UPDATE = '1.4.0';

export const program93ModemFirmware =
    (file: string, vComIndex: number) =>
    (device: DeviceWithSerialnumber): AppThunk<Promise<void>> =>
    async dispatch => {
        try {
            const port = device.serialPorts?.[vComIndex]?.comName;
            if (!port)
                throw new Error(
                    'Failed to Program 93 Modem Firmware: Invalid serialport',
                );

            const box = await getModule('device');
            const args: string[] = [
                '--serial-port',
                port,
                '--firmare',
                path.join(getFirmwareFolder(), file),
            ];

            await box.spawnNrfutilSubcommand(
                'generate',
                args,
                ({ totalProgressPercentage: progress }) =>
                    dispatch(setProgrammingProgress(progress)),
                undefined,
                undefined,
            );

            dispatch(runNextProgrammingAction(device));
        } catch (e) {
            dispatch(
                setError({
                    icon: 'mdi-flash-alert-outline',
                    text: 'Failed to program the Modem Firmware',
                }),
            );
            throw e;
        }
    };

export const onCancel = (): AppThunk => dispatch => {
    dispatch(skipProgrammingAction());
};

export const checkModemFirmwareVersion =
    (version: string, vComIndex: number) =>
    (device: DeviceWithSerialnumber): AppThunk<Promise<void>> =>
    async dispatch => {
        const port = device.serialPorts?.[vComIndex].comName;
        if (!port) {
            dispatch(
                setError({
                    icon: 'mdi-flash-alert-outline',
                    text: 'Failed to communicate with the device',
                }),
            );
            return;
        }

        const res = await sendATCommands(
            [
                {
                    command: 'AT+CGMR',
                    responseRegex: '.*(\\d+\\.\\d+\\.\\d+).*',
                },
            ],
            port,
        ).catch(() => undefined);

        if (res?.length === 1) {
            if (semver.compare(res[0], version) >= 0) {
                dispatch(skipProgrammingAction());
                dispatch(
                    addNote({
                        title: 'Correct Firmware Version',
                        content: `Device is up-to-date with Modem Firmware version: ${res[0]}`,
                    }),
                );
                dispatch(runNextProgrammingAction(device));
            } else if (semver.compare(res[0], MINIMUM_VERSION_TO_UPDATE) <= 0)
                dispatch(
                    setError({
                        icon: 'mdi-flash-alert-outline',
                        text: `Installed Modem Firmware is older than ${MINIMUM_VERSION_TO_UPDATE} and cannot be updated.`,
                    }),
                );
            else
                dispatch(
                    showConfirmDialog(
                        `Downgrading will be unavailable after programming Modem Firmware. Do you want to continue?`,
                    ),
                );
        } else {
            dispatch(
                setError({
                    icon: 'mdi-flash-alert-outline',
                    text: 'Failed to communicate with the device',
                }),
            );
        }
    };
