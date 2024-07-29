/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { type Progress } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';

export interface Firmware {
    core: 'Modem' | 'Application' | 'Network';
    file: string;
    link: { label: string; href: string };
}

interface FirmwareNote {
    title: string;
    content: string;
}

export interface Choice {
    name: string;
    type: 'jlink';
    description: string;
    documentation: { label: string; href: string };
    firmware: Firmware[];
    firmwareNote: FirmwareNote | undefined;
}

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
    PROGRAMMING,
    SUCCESS,
    ERROR,
}

interface State {
    programmingState: ProgrammingState;
    firmwareWithProgress: FirmwareWithProgress[];
    resetProgress: ResetProgress;
    firmwareNote: FirmwareNote | undefined;
}

const initialState: State = {
    programmingState: ProgrammingState.SELECT_FIRMWARE,
    firmwareWithProgress: [],
    resetProgress: ResetProgress.NOT_STARTED,
    firmwareNote: undefined,
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
        setFirmwareNote: (
            state,
            action: PayloadAction<FirmwareNote | undefined>
        ) => {
            state.firmwareNote = action.payload;
        },

        reset: () => initialState,
    },
});

export const {
    setProgrammingState,
    setResetProgress,
    prepareProgramming,
    setProgrammingProgress,
    setFirmwareNote,
    reset,
} = slice.actions;

export const getProgrammingState = (state: RootState) =>
    state.steps.program.programmingState;
export const getProgrammingProgress = (state: RootState) =>
    state.steps.program.firmwareWithProgress;
export const getResetProgress = (state: RootState) =>
    state.steps.program.resetProgress;
export const getFirmwareNote = (state: RootState) =>
    state.steps.program.firmwareNote;

export default slice.reducer;
