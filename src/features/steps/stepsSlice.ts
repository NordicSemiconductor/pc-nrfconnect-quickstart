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

export enum DeviceStep {
    INTRODUCTION,
    PERSONALIZE,
    EVALUATE,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

interface State {
    currentMainStep: MainStep;
    currentDeviceStep: DeviceStep;
}

const initialMainStep = process.argv.includes('--first-launch')
    ? MainStep.WELCOME
    : MainStep.CONNECT;

const initialState: State = {
    currentMainStep: initialMainStep,
    currentDeviceStep: DeviceStep.INTRODUCTION,
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

        goToNextDeviceStep: state => {
            if (state.currentDeviceStep !== DeviceStep.FINISH)
                state.currentDeviceStep += 1;
        },
        goToPreviousDeviceStep: state => {
            state.currentDeviceStep -= 1;
        },
    },
});

export const {
    goToNextDeviceStep,
    goToPreviousDeviceStep,
    setCurrentMainStep,
} = slice.actions;

export const getCurrentMainStep = (state: RootState) =>
    state.steps.currentMainStep;
export const getCurrentDeviceStep = (state: RootState) =>
    state.steps.currentDeviceStep;

export default slice.reducer;
