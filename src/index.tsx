/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'pc-nrfconnect-shared';

import { store, useAppDispatch, useAppSelector } from './app/store';
import Connect from './components/Connect';
import DeviceSteps from './components/DeviceSteps';
import Welcome from './components/Welcome';
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
    const currentStep = useAppSelector(getCurrentStep);

    if (currentStep === Step.WELCOME) return <Welcome />;
    if (currentStep === Step.CONNECT) return <Connect />;
    return <DeviceSteps />;
};

export default () => (
    <Provider store={store}>
        <ConnectedErrorBoundary>
            <App />
        </ConnectedErrorBoundary>
    </Provider>
);
