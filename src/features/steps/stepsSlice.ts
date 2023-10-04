/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

export const steps = [
    'Connect',
    'Info',
    'Rename',
    'Program',
    'Verify',
    'Evaluate',
    'Develop',
    'Learn',
    'Apps',
    'Finish',
] as const;

interface State {
    currentStepIndex: number;
    finishedLastStep: boolean;
}

const initialState: State = {
    currentStepIndex: 0,
    finishedLastStep: false,
};

const slice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        goToNextStep: state => {
            state.currentStepIndex = Math.min(
                (state.currentStepIndex += 1),
                steps.length - 1
            );
        },
        goToPreviousStep: state => {
            state.currentStepIndex = Math.max((state.currentStepIndex -= 1), 0);
        },
        setFinishedLastStep: (state, action: PayloadAction<boolean>) => {
            state.finishedLastStep = action.payload;
        },
    },
});

export const { goToNextStep, goToPreviousStep, setFinishedLastStep } =
    slice.actions;

export const getCurrentStep = (state: RootState) =>
    steps[state.steps.currentStepIndex];
export const getFinishedLastStep = (state: RootState) =>
    state.steps.finishedLastStep;

export default slice.reducer;
