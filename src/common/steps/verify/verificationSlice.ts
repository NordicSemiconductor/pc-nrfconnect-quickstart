/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';
import { setChoice } from '../../../features/device/deviceSlice';

interface State {
    responses: string[];
    failed: boolean;
    showSkip: boolean;
}

const initialState: State = {
    responses: [],
    failed: false,
    showSkip: false,
};

const slice = createSlice({
    name: 'verification',
    initialState,
    reducers: {
        setResponses: (state, action: PayloadAction<string[]>) => {
            state.responses = action.payload;
            state.failed = false;
            state.showSkip = false;
        },
        setFailed: (state, action: PayloadAction<boolean>) => {
            state.failed = action.payload;
            // always keep/set to true except case showSkip=false and payload=false
            state.showSkip = !(state.showSkip === false && !state.failed);
        },
        reset: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(setChoice, () => initialState);
    },
});

export const { setResponses, setFailed, reset } = slice.actions;

export const getResponses = (state: RootState) =>
    state.steps.verification.responses;
export const getFailed = (state: RootState) => state.steps.verification.failed;
export const getShowSkip = (state: RootState) =>
    state.steps.verification.showSkip;

export default slice.reducer;
