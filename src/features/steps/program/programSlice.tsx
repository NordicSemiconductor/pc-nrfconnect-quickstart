/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { type Progress } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';
import { type Firmware } from '../../device/deviceGuides';

type FirmwareWithProgress = Firmware & {
    progress?: Progress;
};

export enum ProgrammingState {
    SELECT_FIRMWARE,
    NO_DEVICE_CONNECTED,
    PROGRAMMING,
    SUCCESS,
    ERROR,
}

interface State {
    programmingState: ProgrammingState;
    firmwareWithProgress: FirmwareWithProgress[];
    programmingError: unknown;
    hasBeenProgrammed: boolean;
}

const initialState: State = {
    programmingState: ProgrammingState.SELECT_FIRMWARE,
    firmwareWithProgress: [],
    programmingError: undefined,
    hasBeenProgrammed: false,
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
        setProgrammingFirmware: (
            state,
            action: PayloadAction<FirmwareWithProgress[]>
        ) => {
            state.firmwareWithProgress = action.payload;
        },
        setProgrammingProgress: (
            state,
            action: PayloadAction<{
                progress: Progress;
                index: number;
            }>
        ) => {
            const updatedFirmwareWithProgress = state.firmwareWithProgress.map(
                (f, index) =>
                    index === action.payload.index
                        ? {
                              ...f,
                              progress: action.payload.progress,
                          }
                        : f
            );

            state.firmwareWithProgress = updatedFirmwareWithProgress;
        },
        setProgrammingError: (state, action: PayloadAction<unknown>) => {
            state.programmingError = action.payload;
        },
        setHasBeenProgrammed: state => {
            state.hasBeenProgrammed = true;
        },
    },
});

export const {
    setProgrammingState,
    setProgrammingFirmware,
    setProgrammingProgress,
    setProgrammingError,
    setHasBeenProgrammed,
} = slice.actions;

export const getProgrammingState = (state: RootState) =>
    state.program.programmingState;
export const getProgrammingProgress = (state: RootState) =>
    state.program.firmwareWithProgress;
export const getProgrammingError = (state: RootState) =>
    state.program.programmingError;
export const getHasBeenProgrammed = (state: RootState) =>
    state.program.hasBeenProgrammed;

export default slice.reducer;
