/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'pc-nrfconnect-shared';

import { store, useAppDispatch, useAppSelector } from './app/store';
import Apps from './components/Apps';
import Connect from './components/Connect';
import Develop from './components/Develop';
import Finish from './components/Finish';
import Introduction from './components/Introduction';
import Learn from './components/Learn';
import Personalize from './components/Personalize';
import Program from './components/Program';
import SelectFirmware from './components/SelectFirmware';
import Welcome from './components/Welcome';
import { Choice } from './features/device/deviceGuides';
import { startWatchingDevices } from './features/device/deviceLib';
import {
    addDevice,
    getConnectedDevices,
    getSelectedDevice,
    removeDevice,
} from './features/device/deviceSlice';
import { getCurrentStep, Step } from './features/steps/stepsSlice';

import './index.scss';

const ConnectedErrorBoundary: React.FC = ({ children }) => {
    const devices = useAppSelector(getConnectedDevices);
    const selectedDevice = useAppSelector(getSelectedDevice);

    return (
        <ErrorBoundary
            devices={devices}
            selectedDevice={selectedDevice}
            selectedSerialNumber={selectedDevice?.serialNumber ?? undefined}
        >
            {children}
        </ErrorBoundary>
    );
};

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

const App = () => {
    useDevicesInStore();

    const [choice, setChoice] = useState<Choice>();
    const currentStep = useAppSelector(getCurrentStep);

    return (
        <>
            {currentStep === Step.WELCOME && <Welcome />}
            {currentStep === Step.CONNECT && <Connect />}
            {currentStep === Step.INTRODUCTION && <Introduction />}
            {currentStep === Step.PERSONALIZE && <Personalize />}
            {currentStep === Step.SELECT_FIRMWARE && (
                <SelectFirmware selectChoice={setChoice} />
            )}
            {currentStep === Step.PROGRAM && (
                <Program
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice
                    selectedFirmware={choice!.firmware}
                    selectChoice={setChoice}
                />
            )}
            {currentStep === Step.APPS && <Apps />}
            {currentStep === Step.LEARN && <Learn />}
            {currentStep === Step.DEVELOP && <Develop />}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice */}
            {currentStep === Step.FINISH && <Finish choice={choice!} />}
        </>
    );
};

export default () => (
    <Provider store={store}>
        <ConnectedErrorBoundary>
            <App />
        </ConnectedErrorBoundary>
    </Provider>
);
