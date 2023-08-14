/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Provider } from 'react-redux';
import {
    ErrorBoundary,
    render,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { App } from './app/App';
import { store, useAppSelector } from './app/store';
import {
    getConnectedDevices,
    getSelectedDevice,
} from './features/device/deviceSlice';

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

const ConnectedToStore = () => (
    <Provider store={store}>
        <ConnectedErrorBoundary>
            <App />
        </ConnectedErrorBoundary>
    </Provider>
);

render(<ConnectedToStore />);
