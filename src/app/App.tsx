/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { match } from 'ts-pattern';

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

    const appState = useAppSelector(getAppState);

    return match(appState)
        .with({ currentStep: Step.WELCOME }, () => <Welcome />)
        .with({ currentStep: Step.CONNECT }, () => <Connect />)
        .with({ currentStep: Step.INTRODUCTION }, state => (
            <Introduction {...state} />
        ))
        .with({ currentStep: Step.PERSONALIZE }, state => (
            <Personalize {...state} />
        ))
        .with({ currentStep: Step.SELECT_FIRMWARE }, state => (
            <SelectFirmware {...state} />
        ))
        .with({ currentStep: Step.PROGRAM }, state => <Program {...state} />)
        .with({ currentStep: Step.APPS }, state => <Apps {...state} />)
        .with({ currentStep: Step.LEARN }, state => <Learn {...state} />)
        .with({ currentStep: Step.DEVELOP }, state => <Develop {...state} />)
        .with({ currentStep: Step.FINISH }, state => <Finish {...state} />);
};
