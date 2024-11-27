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
    prepareProgramming,
    removeError,
    RetryRef,
    setError,
    setProgrammingProgress,
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

interface VisibleBatchOperation {
    title: string;
    link?: { label: string; href: string };
}

const jlinkProgram =
    (
        choice: Choice,
        batch: ReturnType<typeof NrfutilDeviceLib.batch>
    ): AppThunk<RootState, VisibleBatchOperation[]> =>
    dispatch => {
        const cores = choice.firmware.reduce((prev, curr) => {
            const nonModemCore =
                curr.core === 'Modem' ? 'Application' : curr.core;
            if (prev.includes(nonModemCore)) return prev;
            return prev.concat(nonModemCore);
        }, [] as Omit<DeviceCore, 'Modem'>[]);

        cores.forEach((core, index) => {
            batch.recover(core as DeviceCore, {
                onTaskBegin: () => {
                    dispatch(
                        setProgrammingProgress({
                            index: 0,
                            // index + 1 because we should show some progress on the first action
                            progress: ((index + 1) / (cores.length + 1)) * 100,
                        })
                    );
                },
                onTaskEnd: end => {
                    if (end.error) {
                        dispatch(
                            setError({
                                icon: 'mdi-lightbulb-alert-outline',
                                text: 'Failed to erase device',
                            })
                        );
                    }
                },
            });
        });
        batch.collect(cores.length, () => {
            dispatch(setProgrammingProgress({ index: 0, progress: 100 }));
        });

        choice.firmware.forEach(({ file, core }, index) => {
            batch.program(
                path.join(getFirmwareFolder(), file),
                core === 'Modem' ? 'Application' : core,
                undefined,
                undefined,
                {
                    onProgress: ({
                        totalProgressPercentage: progress,
                    }: Progress) =>
                        dispatch(
                            setProgrammingProgress({
                                index: index + 1,
                                progress,
                            })
                        ),
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

        // use 'RESET_DEFAULT' which is default when not passing anything for reset argument
        batch.reset('Application', undefined, {
            onTaskBegin: () => {
                dispatch(
                    setProgrammingProgress({
                        index: 1 + choice.firmware.length,
                        progress: 50,
                    })
                );
            },
            onTaskEnd: end => {
                if (end.result === 'success') {
                    dispatch(
                        setProgrammingProgress({
                            index: 1 + choice.firmware.length,
                            progress: 100,
                        })
                    );
                }
                if (end.error) {
                    dispatch(
                        setError({
                            icon: 'mdi-restore-alert',
                            text: 'Failed to reset the device',
                            buttonText: 'Reset',
                            retryRef: 'reset',
                        })
                    );
                }
            },
        });

        return [
            { title: 'Erase device' },
            ...choice.firmware.map(f => ({
                title: `${f.core} core`,
                link: f.link,
            })),
            { title: 'Reset device' },
        ];
    };

const buttonlessDfuProgram =
    (
        choice: Choice,
        batch: ReturnType<typeof NrfutilDeviceLib.batch>
    ): AppThunk<RootState, VisibleBatchOperation[]> =>
    dispatch => {
        choice.firmware.forEach(({ file, core }) => {
            batch.program(
                path.join(getFirmwareFolder(), file),
                core === 'Modem' ? 'Application' : core,
                undefined,
                undefined,
                {
                    onProgress: ({
                        totalProgressPercentage: progress,
                    }: Progress) =>
                        dispatch(
                            setProgrammingProgress({
                                index: 0,
                                progress,
                            })
                        ),
                    onTaskEnd: end => {
                        if (end.error) {
                            // Thingy91X gets an onProgress event 100% when it fails which breaks expectations here. It will be changed/fixed in nrfutil
                            dispatch(
                                setProgrammingProgress({
                                    index: 0,
                                    progress: 0,
                                })
                            );
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

        return [
            ...choice.firmware.map(f => ({
                title: `${f.core} core`,
                link: f.link,
            })),
        ];
    };

export const startProgramming = (): AppThunk => (dispatch, getState) => {
    const choice = getChoiceUnsafely(getState());
    dispatch(removeError(undefined));

    const device = getSelectedDeviceUnsafely(getState());
    const batch = NrfutilDeviceLib.batch();
    let displayedBatchOperations: {
        title: string;
        link?: { label: string; href: string };
    }[];

    switch (choice.type) {
        case 'jlink':
            displayedBatchOperations = dispatch(jlinkProgram(choice, batch));
            break;
        case 'buttonless-dfu':
            displayedBatchOperations = dispatch(
                buttonlessDfuProgram(choice, batch)
            );
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

    dispatch(prepareProgramming(displayedBatchOperations));

    if (!dispatch(checkDeviceConnected())) return;

    return batch.run(device).catch(() => {
        if (!getState().steps.program.error) {
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'Unknown error',
                })
            );
        }
    });
};

export const retry =
    (retryref: RetryRef = 'standard'): AppThunk =>
    dispatch => {
        switch (retryref) {
            case 'reset':
                return dispatch(resetDevice());
            case 'standard':
            default:
                return dispatch(startProgramming());
        }
    };

const resetDevice = (): AppThunk => (dispatch, getState) => {
    if (!dispatch(checkDeviceConnected())) return;

    const device = getSelectedDeviceUnsafely(getState());

    // batchWithProgress should always be filled here
    const batchLength = getState().steps.program.batchWithProgress?.length;
    // length 0 is alse an invalid state
    if (!batchLength) {
        console.error('Could not find valid programming progress batch');
        dispatch(
            setError({
                icon: 'mdi-lightbulb-alert-outline',
                text: 'Program is in invalid state. Please contact support.',
            })
        );
        return;
    }
    dispatch(removeError(undefined));
    const index = batchLength - 1;
    dispatch(
        setProgrammingProgress({
            index,
            progress: 50,
        })
    );

    reset(device)
        .then(() => {
            dispatch(
                setProgrammingProgress({
                    index,
                    progress: 100,
                })
            );
        })
        .catch(() =>
            dispatch(
                setError({
                    icon: 'mdi-restore-alert',
                    text: 'Failed to reset the device',
                    buttonText: 'Reset',
                    retryRef: 'reset',
                })
            )
        );
};
