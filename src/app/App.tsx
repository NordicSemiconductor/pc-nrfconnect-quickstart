/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';

import { getAppState } from '../features/appState/appStateSlice';
import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Apps from '../features/steps/Apps';
import Connect from '../features/steps/Connect';
import Develop from '../features/steps/Develop';
import Finish from '../features/steps/Finish';
import Introduction from '../features/steps/Introduction';
import Learn from '../features/steps/Learn';
import Personalize from '../features/steps/Personalize';
import Program from '../features/steps/Program';
import SelectFirmware from '../features/steps/SelectFirmware';
import Step from '../features/steps/Step';
import Welcome from '../features/steps/Welcome';
import { useAppDispatch, useAppSelector } from './store';

import './App.scss';

const useDevicesInStore = () => {
    const dispatch = useAppDispatch();

    useEffect(
        () =>
            startWatchingDevices(
                device => dispatch(addDevice(device)),
                deviceId => dispatch(removeDevice(deviceId))
            ),
        [dispatch]
    );
};

export const App = () => {
    useDevicesInStore();

    const state = useAppSelector(getAppState);

    return (
        <>
            {state.currentStep === Step.WELCOME && <Welcome />}
            {state.currentStep === Step.CONNECT && <Connect />}
            {state.currentStep === Step.INTRODUCTION && (
                <Introduction {...state} />
            )}
            {state.currentStep === Step.PERSONALIZE && (
                <Personalize {...state} />
            )}
            {state.currentStep === Step.SELECT_FIRMWARE && (
                <SelectFirmware {...state} />
            )}
            {state.currentStep === Step.PROGRAM && <Program {...state} />}
            {state.currentStep === Step.APPS && <Apps {...state} />}
            {state.currentStep === Step.LEARN && <Learn {...state} />}
            {state.currentStep === Step.DEVELOP && <Develop {...state} />}
            {state.currentStep === Step.FINISH && <Finish {...state} />}
        </>
    );
};
