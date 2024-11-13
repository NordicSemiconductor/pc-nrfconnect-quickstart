/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Progress } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import {
    DeviceCore,
    NrfutilDeviceLib,
} from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import path from 'path';

import { type AppThunk, RootState } from '../../../app/store';
import { getFirmwareFolder } from '../../../features/device/deviceGuides';
import { reset } from '../../../features/device/deviceLib';
import {
    Choice,
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../../features/device/deviceSlice';
import {
    removeError,
    setActiveBatchComponent,
    setBatchLength,
    setError,
    setProgrammingProgress,
    softReset,
} from './programSlice';

const checkDeviceConnected =
    (): AppThunk<RootState, boolean> => (dispatch, getState) => {
        if (!selectedDeviceIsConnected(getState())) {
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'No development kit detected',
                })
            );
            return false;
        }
        return true;
    };

const jlinkProgram =
    (
        choice: Choice,
        batch: ReturnType<typeof NrfutilDeviceLib.batch>
    ): AppThunk<RootState, number> =>
    dispatch => {
        const coresToErase = choice.firmware.reduce((prev, curr) => {
            const nonModemCore =
                curr.core === 'Modem' ? 'Application' : curr.core;
            if (prev.includes(nonModemCore)) return prev;
            return prev.concat(nonModemCore);
        }, [] as Omit<DeviceCore, 'Modem'>[]);

        dispatch(
            setActiveBatchComponent({
                title: 'Erase device',
            })
        );
        dispatch(setProgrammingProgress(50));
        coresToErase.forEach(core => {
            batch.recover(core as DeviceCore);
        });

        batch.collect(coresToErase.length, () => {
            dispatch(setProgrammingProgress(100));
        });

        choice.firmware.forEach(({ file, core, link }) => {
            batch.program(
                path.join(getFirmwareFolder(), file),
                core === 'Modem' ? 'Application' : core,
                undefined,
                undefined,
                {
                    onTaskBegin: () => {
                        dispatch(
                            setActiveBatchComponent({
                                title: `${core} core`,
                                link,
                            })
                        );
                    },
                    onProgress: ({
                        totalProgressPercentage: progress,
                    }: Progress) => dispatch(setProgrammingProgress(progress)),
                    onTaskEnd: end => {
                        if (end.error) {
                            dispatch(
                                setError({
                                    icon: 'mdi-flash-alert-outline',
                                    text: `Failed to program the ${core} core`,
                                })
                            );
                        }
                    },
                }
            );
        });

        return 1 + choice.firmware.length;
    };

const buttonlessDfuProgram =
    (
        choice: Choice,
        batch: ReturnType<typeof NrfutilDeviceLib.batch>
    ): AppThunk<RootState, number> =>
    dispatch => {
        choice.firmware.forEach(({ file, link, core }) => {
            batch.program(
                path.join(getFirmwareFolder(), file),
                core === 'Modem' ? 'Application' : core,
                undefined,
                undefined,
                {
                    onTaskBegin: () => {
                        dispatch(
                            setActiveBatchComponent({
                                title: `${core} core`,
                                link,
                            })
                        );
                    },
                    onProgress: ({
                        totalProgressPercentage: progress,
                    }: Progress) => dispatch(setProgrammingProgress(progress)),
                    onTaskEnd: end => {
                        if (end.error) {
                            dispatch(
                                setError({
                                    icon: 'mdi-flash-alert-outline',
                                    text: `Failed to program the ${core} core`,
                                })
                            );
                        }
                    },
                }
            );
        });

        return choice.firmware.length;
    };

export const startProgramming = (): AppThunk => (dispatch, getState) => {
    dispatch(softReset());
    const choice = getChoiceUnsafely(getState());

    const device = getSelectedDeviceUnsafely(getState());
    const batch = NrfutilDeviceLib.batch();
    let batchLength: number;

    switch (choice.type) {
        case 'jlink':
            batchLength = dispatch(jlinkProgram(choice, batch));
            break;
        case 'buttonless-dfu':
            batchLength = dispatch(buttonlessDfuProgram(choice, batch));
            break;
        default:
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'Unsupported programming choice',
                })
            );
            return;
    }

    // use 'RESET_DEFAULT' which is default when not passing anything for reset argument
    batch.reset('Application', undefined, {
        onTaskBegin: () => {
            dispatch(setActiveBatchComponent({ title: 'Reset device' }));
            dispatch(setProgrammingProgress(50));
            dispatch(
                setError({
                    icon: 'mdi-restore-alert',
                    text: 'Failed to reset the device',
                })
            );
        },
        onTaskEnd: end => {
            if (end.result === 'success') {
                dispatch(setProgrammingProgress(100));
            }
        },
        onException: () => {
            dispatch(
                setError({
                    icon: 'mdi-restore-alert',
                    text: 'Failed to reset the device',
                })
            );
        },
    });

    dispatch(setBatchLength(batchLength + 1));

    if (!dispatch(checkDeviceConnected())) return;

    return batch.run(device);
};

export const resetDevice = (): AppThunk => (dispatch, getState) => {
    if (!dispatch(checkDeviceConnected())) return;

    const device = getSelectedDeviceUnsafely(getState());

    dispatch(removeError(undefined));
    dispatch(setProgrammingProgress(50));

    reset(device)
        .then(() => {
            dispatch(setProgrammingProgress(100));
        })
        .catch(() =>
            dispatch(
                setError({
                    icon: 'mdi-restore-alert',
                    text: 'Failed to reset the device',
                })
            )
        );
};
