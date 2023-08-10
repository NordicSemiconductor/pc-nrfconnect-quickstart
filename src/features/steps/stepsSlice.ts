/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

export enum Step {
    WELCOME,
    CONNECT,
    INTRODUCTION,
    PERSONALIZE,
    EVALUATE,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

interface State {
    currentStep: Step;
}

const initialMainStep = process.argv.includes('--first-launch')
    ? Step.WELCOME
    : Step.CONNECT;

const initialState: State = {
    currentStep: initialMainStep,
};

const slice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        goToNextStep: state => {
            state.currentStep += 1;
        },
        goToPreviousStep: state => {
            state.currentStep -= 1;
        },
    },
});

export const { goToNextStep, goToPreviousStep } = slice.actions;

export const getCurrentStep = (state: RootState) => state.steps.currentStep;

export default slice.reducer;
