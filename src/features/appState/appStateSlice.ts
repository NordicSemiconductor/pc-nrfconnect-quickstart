/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device } from 'pc-nrfconnect-shared';

import { type RootState } from '../../app/store';
import { Choice } from '../device/deviceGuides';
import Step, {
    initialStep,
    skipOnBackwardNavigation,
    StepWithDevice,
    StepWithDeviceAndChoice,
    StepWithoutDevice,
} from '../steps/Step';

type State =
    | { currentStep: StepWithoutDevice }
    | {
          currentStep: StepWithDevice;
          device: Device;
      }
    | {
          currentStep: StepWithDeviceAndChoice;
          device: Device;
          choice: Choice;
      };

const initialState = {
    currentStep: initialStep,
};

const slice = createSlice({
    name: 'appState',
    initialState: initialState as State,
    reducers: {
        goToNextStep: state => {
            state.currentStep += 1;
        },
        goToPreviousStep: state => {
            do {
                state.currentStep -= 1;
            } while (skipOnBackwardNavigation(state.currentStep));
        },

        selectDevice: (state, { payload: device }: PayloadAction<Device>) => {
            if (state.currentStep !== Step.CONNECT) {
                throw new Error('Must only be called in the step CONNECT');
            }

            return {
                currentStep: state.currentStep + 1,
                device,
            };
        },

        setChoice: (state, { payload: choice }: PayloadAction<Choice>) => {
            if (state.currentStep !== Step.SELECT_FIRMWARE) {
                throw new Error(
                    'Must only be called in the step SELECT_FIRMWARE'
                );
            }

            return {
                currentStep: state.currentStep + 1,
                device: state.device,
                choice,
            };
        },
    },
});

export const { goToNextStep, goToPreviousStep, selectDevice, setChoice } =
    slice.actions;

export const getAppState = (state: RootState) => state.app;
export const getSelectedDevice = (state: RootState) =>
    'device' in state.app ? state.app.device : undefined;

export default slice.reducer;
