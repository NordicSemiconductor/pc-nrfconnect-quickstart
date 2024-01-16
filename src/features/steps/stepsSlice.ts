/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';
import { type Step as ConfigSteps } from '../device/deviceGuides';

export type Step = 'connect' | ConfigSteps | 'finish';

interface State {
    steps: Step[];
    currentStepIndex: number;
    finishedLastStep: boolean;
}

const initialState: State = {
    steps: ['connect'],
    currentStepIndex: 0,
    finishedLastStep: false,
};

const slice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        setSteps: (state, action: PayloadAction<Step[]>) => {
            state.steps = ['connect', ...action.payload, 'finish'];
        },
        goToNextStep: state => {
            state.currentStepIndex = Math.min(
                (state.currentStepIndex += 1),
                state.steps.length - 1
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

export const { setSteps, goToNextStep, goToPreviousStep, setFinishedLastStep } =
    slice.actions;

export const getSteps = (state: RootState) => state.steps.steps;
export const getCurrentStep = (state: RootState) =>
    state.steps.steps[state.steps.currentStepIndex];
export const getFinishedLastStep = (state: RootState) =>
    state.steps.finishedLastStep;
export const isFirstStep = (state: RootState) =>
    state.steps.currentStepIndex === 0;

export default slice.reducer;
