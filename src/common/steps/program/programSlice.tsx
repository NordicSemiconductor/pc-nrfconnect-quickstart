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

interface State {
    index: number;
    progress: number;
    batchLength: number;
    batchWithProgress?: BatchComponent;
    error?: { icon: string; text: string };
}

const initialState: State = {
    index: -1,
    progress: 0,
    batchLength: 0,
    batchWithProgress: undefined,
    error: undefined,
};

const slice = createSlice({
    name: 'program',
    initialState,
    reducers: {
        setBatchLength: (state, action: PayloadAction<number>) => {
            state.batchLength = action.payload;
        },
        setActiveBatchComponent: (
            state,
            action: PayloadAction<BatchComponent>
        ) => {
            state.batchWithProgress = action.payload;
            state.index += 1;
            state.progress = 0;
        },
        setProgrammingProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
        setError: (
            state,
            action: PayloadAction<{ icon: string; text: string }>
        ) => {
            state.error = action.payload;
        },
        softReset: state => {
            state.index = -1;
            state.progress = 0;
            state.batchWithProgress = undefined;
            state.error = undefined;
        },
        removeError: state => {
            state.error = undefined;
        },

        reset: () => initialState,
    },
});

export const {
    setActiveBatchComponent,
    setProgrammingProgress,
    setBatchLength,
    setError,
    removeError,
    softReset,
    reset,
} = slice.actions;

export const getActiveBatchComponentIndex = (state: RootState) =>
    state.steps.program.index;
export const getActiveBatchComponent = (state: RootState) =>
    state.steps.program.batchWithProgress;
export const getProgrammingProgress = (state: RootState) =>
    state.steps.program.progress;
export const getProgrammingBatchLength = (state: RootState) =>
    state.steps.program.batchLength;
export const getError = (state: RootState) => state.steps.program.error;

export default slice.reducer;
