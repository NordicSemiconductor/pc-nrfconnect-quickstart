/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

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
    setProgrammingFirmware,
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
    dispatch(setProgrammingFirmware(firmware));

    program(device, firmware, (index, progress) =>
        dispatch(setProgrammingProgress({ index, progress }))
    )
        .then(() => dispatch(setProgrammingState(ProgrammingState.SUCCESS)))
        .catch(error => {
            dispatch(setProgrammingError(error));
            dispatch(setProgrammingState(ProgrammingState.ERROR));
        });
};
