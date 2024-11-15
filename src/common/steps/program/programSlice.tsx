/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';

type BatchComponent = {
    title: string;
    link?: { label: string; href: string };
};

type BatchWithProgress = BatchComponent & {
    progress?: number;
};

export type RetryRef = 'reset' | 'standard';
interface Error {
    icon: string;
    text: string;
    buttonText?: string;
    retryRef?: RetryRef;
}

interface State {
    batchWithProgress?: BatchWithProgress[];
    error?: Error;
}

const initialState: State = {
    batchWithProgress: undefined,
    error: undefined,
};

const slice = createSlice({
    name: 'program',
    initialState,
    reducers: {
        prepareProgramming: (
            state,
            action: PayloadAction<BatchWithProgress[]>
        ) => {
            state.batchWithProgress = action.payload;
        },
        setProgrammingProgress: (
            state,
            action: PayloadAction<{
                progress: number;
                index: number;
            }>
        ) => {
            // This is here for lint but cannot happen
            if (!state.batchWithProgress) return;

            const updatedFirmwareWithProgress = state.batchWithProgress.map(
                (f, index) =>
                    index === action.payload.index
                        ? {
                              ...f,
                              progress: action.payload.progress,
                          }
                        : f
            );

            state.batchWithProgress = updatedFirmwareWithProgress;
        },
        setError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload;
        },
        removeError: state => {
            state.error = undefined;
        },

        reset: () => initialState,
    },
});

export const {
    prepareProgramming,
    setProgrammingProgress,
    setError,
    removeError,
    reset,
} = slice.actions;

export const getProgrammingProgress = (state: RootState) =>
    state.steps.program.batchWithProgress;
export const getError = (state: RootState) => state.steps.program.error;

export default slice.reducer;
