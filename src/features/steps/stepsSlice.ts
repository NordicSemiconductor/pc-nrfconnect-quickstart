/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

export const steps = [
    'Connect',
    'Introduction',
    'Personalize',
    'Program',
    'Apps',
    'Learn',
    'Develop',
    'Finish',
] as const;

interface State {
    currentStepIndex: number;
}

const initialState: State = {
    currentStepIndex: 0,
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
    },
});

export const { goToNextStep, goToPreviousStep } = slice.actions;

export const getCurrentStep = (state: RootState) =>
    steps[state.steps.currentStepIndex];

export default slice.reducer;
