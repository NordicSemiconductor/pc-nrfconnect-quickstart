/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { getCurrentWindow } from '@electron/remote';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { ipcRenderer } from 'electron';
import { ErrorBoundary } from 'pc-nrfconnect-shared';

import Connect from './components/Connect';
import DeviceSteps from './components/DeviceSteps';
import Welcome from './components/Welcome';
import {
    connectedDevicesEvents,
    getConnectedDevices,
    startWatchingDevices,
} from './features/deviceLib';

import './index.scss';

enum Steps {
    WELCOME,
    CONNECT,
    DEVICE_STEPS,
}

const getInitialStep = () => {
    if (process.argv.includes('--first-launch')) {
        return Steps.WELCOME;
    }
    return Steps.CONNECT;
};

export default () => {
    const [connectedDevices, setConnectedDevices] = useState<Device[]>(
        getConnectedDevices()
    );
    const [selectedDevice, setSelectedDevice] = useState<Device | undefined>();
    const [currentStep, setCurrentStep] = useState(getInitialStep());

    useEffect(() => {
        connectedDevicesEvents.on('update', setConnectedDevices);
        const cleanup = startWatchingDevices();

        return () => {
            cleanup.then(cb => cb());
            connectedDevicesEvents.removeListener(
                'update',
                setConnectedDevices
            );
        };
    }, []);

    return (
        <ErrorBoundary
            devices={connectedDevices}
            selectedDevice={selectedDevice}
            selectedSerialNumber={selectedDevice?.serialNumber}
        >
            {currentStep === Steps.WELCOME && (
                <Welcome
                    quit={() => {
                        ipcRenderer.send('open-app-launcher');
                        getCurrentWindow().close();
                    }}
                    next={() => setCurrentStep(Steps.CONNECT)}
                />
            )}
            {currentStep === Steps.CONNECT && (
                <Connect
                    next={(device: Device) => {
                        setSelectedDevice(device);
                        setCurrentStep(Steps.DEVICE_STEPS);
                    }}
                />
            )}
            {currentStep === Steps.DEVICE_STEPS && selectedDevice && (
                <DeviceSteps
                    device={selectedDevice}
                    goBackToConnect={() => {
                        setSelectedDevice(undefined);
                        setCurrentStep(Steps.CONNECT);
                    }}
                />
            )}
        </ErrorBoundary>
    );
};
