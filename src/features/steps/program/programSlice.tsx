/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { type Progress } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';
import { type Firmware } from '../../device/deviceGuides';

export enum ResetProgress {
    NOT_STARTED,
    STARTED,
    FINISHED,
}

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
    resetProgress: ResetProgress;
    programmingError: unknown;
}

const initialState: State = {
    programmingState: ProgrammingState.SELECT_FIRMWARE,
    firmwareWithProgress: [],
    resetProgress: ResetProgress.NOT_STARTED,
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
        prepareProgramming: (
            state,
            action: PayloadAction<FirmwareWithProgress[]>
        ) => {
            state.firmwareWithProgress = action.payload;
            state.resetProgress = ResetProgress.NOT_STARTED;
            state.programmingState = ProgrammingState.PROGRAMMING;
        },
        setResetProgress: (
            state,
            { payload: resetProgress }: PayloadAction<ResetProgress>
        ) => {
            state.resetProgress = resetProgress;
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
    },
});

export const {
    setProgrammingState,
    setResetProgress,
    prepareProgramming,
    setProgrammingProgress,
} = slice.actions;

export const getProgrammingState = (state: RootState) =>
    state.program.programmingState;
export const getProgrammingProgress = (state: RootState) =>
    state.program.firmwareWithProgress;
export const getResetProgress = (state: RootState) =>
    state.program.resetProgress;

export default slice.reducer;
