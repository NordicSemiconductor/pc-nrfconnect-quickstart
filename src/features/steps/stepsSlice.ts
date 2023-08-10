/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

export enum MainStep {
    WELCOME,
    CONNECT,
    DEVICE_STEPS,
}

interface State {
    currentMainStep: MainStep;
}

const initialMainStep = process.argv.includes('--first-launch')
    ? MainStep.WELCOME
    : MainStep.CONNECT;

const initialState: State = {
    currentMainStep: initialMainStep,
};

const slice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        setCurrentMainStep: (
            state,
            { payload: step }: PayloadAction<MainStep>
        ) => {
            state.currentMainStep = step;
        },
    },
});

export const { setCurrentMainStep } = slice.actions;

export const getCurrentMainStep = (state: RootState) =>
    state.steps.currentMainStep;

export default slice.reducer;
