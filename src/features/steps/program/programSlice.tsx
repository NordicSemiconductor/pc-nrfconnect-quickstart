/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Progress } from '@nordicsemiconductor/nrf-device-lib-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';
import { type Firmware } from '../../device/deviceGuides';

type FirmwareWithProgress = Firmware & {
    progressInfo?: Progress.Operation;
};

export enum ProgrammingState {
    NO_DEVICE_CONNECTED,
    PROGRAMMING,
    SUCCESS,
    ERROR,
}

interface State {
    programmingState: ProgrammingState;
    firmwareWithProgress: FirmwareWithProgress[];
    programmingError: unknown;
}

const initialState: State = {
    programmingState: ProgrammingState.NO_DEVICE_CONNECTED,
    firmwareWithProgress: [],
    programmingError: undefined,
};

const slice = createSlice({
    name: 'program',
    initialState,
    reducers: {
        setProgrammingState: (
            state,
            action: PayloadAction<ProgrammingState>
        ) => {
            state.programmingState = action.payload;
        },
        setProgrammingProgress: (
            state,
            action: PayloadAction<FirmwareWithProgress[]>
        ) => {
            state.firmwareWithProgress = action.payload;
        },
        setProgrammingError: (state, action: PayloadAction<unknown>) => {
            state.programmingError = action.payload;
        },
    },
});

export const {
    setProgrammingState,
    setProgrammingProgress,
    setProgrammingError,
} = slice.actions;

export const getProgrammingState = (state: RootState) =>
    state.program.programmingState;
export const getProgrammingProgress = (state: RootState) =>
    state.program.firmwareWithProgress;
export const getProgrammingError = (state: RootState) =>
    state.program.programmingError;

export default slice.reducer;
