/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { getCurrentWindow } from '@electron/remote';
import { ErrorBoundary, openWindow } from 'pc-nrfconnect-shared';

import { store, useAppDispatch, useAppSelector } from './app/store';
import Connect from './components/Connect';
import DeviceSteps from './components/DeviceSteps';
import Welcome from './components/Welcome';
import { startWatchingDevices } from './features/deviceLib';
import {
    addDevice,
    getConnectedDevices,
    getSelectedDevice,
    removeDevice,
} from './features/deviceSlice';

import './index.scss';

enum Steps {
    WELCOME,
    CONNECT,
    DEVICE_STEPS,
}

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

const getInitialStep = () =>
    process.argv.includes('--first-launch') ? Steps.WELCOME : Steps.CONNECT;

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
    const [currentStep, setCurrentStep] = useState(getInitialStep());

    return (
        <>
            {currentStep === Steps.WELCOME && (
                <Welcome
                    quit={() => {
                        openWindow.openLauncher();
                        getCurrentWindow().close();
                    }}
                    next={() => setCurrentStep(Steps.CONNECT)}
                />
            )}
            {currentStep === Steps.CONNECT && (
                <Connect
                    next={() => {
                        setCurrentStep(Steps.DEVICE_STEPS);
                    }}
                />
            )}
            {currentStep === Steps.DEVICE_STEPS && (
                <DeviceSteps
                    goBackToConnect={() => {
                        setCurrentStep(Steps.CONNECT);
                    }}
                />
            )}
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
