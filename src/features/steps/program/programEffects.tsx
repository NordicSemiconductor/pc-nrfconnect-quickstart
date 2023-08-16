/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    deviceInfo,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { type AppThunk } from '../../../app/store';
import { program } from '../../device/deviceLib';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../device/deviceSlice';
import {
    ProgrammingState,
    setProgrammingError,
    setProgrammingProgress,
    setProgrammingState,
} from './programSlice';

export const startProgramming = (): AppThunk => (dispatch, getState) => {
    const deviceConnected = selectedDeviceIsConnected(getState());
    const device = getSelectedDeviceUnsafely(getState());
    const firmware = getChoiceUnsafely(getState()).firmware;

    if (!deviceConnected) {
        dispatch(setProgrammingState(ProgrammingState.NO_DEVICE_CONNECTED));
        return;
    }

    dispatch(setProgrammingState(ProgrammingState.PROGRAMMING));
    dispatch(setProgrammingProgress(firmware));

    try {
        program(
            device,
            firmware,
            progress => {
                if (!progress.progressJson.operationId) return;

                const taskId = Number.parseInt(
                    progress.progressJson.operationId,
                    10
                );
                if (taskId < firmware.length) {
                    const { firmwareWithProgress } = getState().program;

                    const updatedFirmwareWithProgress =
                        firmwareWithProgress.map((f, index) =>
                            index === taskId
                                ? {
                                      ...f,
                                      progressInfo: progress.progressJson,
                                  }
                                : f
                        );

                    dispatch(
                        setProgrammingProgress(updatedFirmwareWithProgress)
                    );
                }
            },
            error => {
                if (error) {
                    dispatch(setProgrammingError(error));
                    dispatch(setProgrammingState(ProgrammingState.ERROR));
                } else {
                    setTimeout(
                        () =>
                            dispatch(
                                setProgrammingState(ProgrammingState.SUCCESS)
                            ),
                        1000
                    );
                }
            }
        );
    } catch (error) {
        dispatch(setProgrammingError(error));
        dispatch(setProgrammingState(ProgrammingState.ERROR));
    }
};
