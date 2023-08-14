/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { ErrorBoundary } from '@nordicsemiconductor/pc-nrfconnect-shared';

import Connect from './components/Connect';
import DeviceSteps from './components/DeviceSteps';
import {
    connectedDevicesEvents,
    getConnectedDevices,
    startWatchingDevices,
} from './features/deviceLib';

import './index.scss';

export default () => {
    const [connectedDevices, setConnectedDevices] = useState<Device[]>(
        getConnectedDevices()
    );
    const [selectedDevice, setSelectedDevice] = useState<Device>();

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
            {!selectedDevice && (
                <Connect
                    next={(device: Device) => {
                        setSelectedDevice(device);
                    }}
                />
            )}
            {selectedDevice && (
                <DeviceSteps
                    device={selectedDevice}
                    goBackToConnect={() => {
                        setSelectedDevice(undefined);
                    }}
                />
            )}
        </ErrorBoundary>
    );
};
