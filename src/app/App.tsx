/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { logger, telemetry } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { setNrfutilLogger } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Flow from '../features/flow';
import Header from './Header';
import { useAppDispatch } from './store';

import './App.scss';

telemetry.enableTelemetry();

const useDevicesInStore = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const stopWatchingDevicesPromise = startWatchingDevices(
            device => dispatch(addDevice(device)),
            deviceId => dispatch(removeDevice(deviceId))
        );
        logger.debug('Started watching devices');

        return () => {
            stopWatchingDevicesPromise.then(stopWatchingDevices =>
                stopWatchingDevices()
            );
        };
    }, [dispatch]);
};

export const App = () => {
    useEffect(() => {
        logger.initialise();
        setNrfutilLogger(logger);
        NrfutilDeviceLib.setLogLevel('error');
    }, []);
    useDevicesInStore();

    return (
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
            <Header />
            <div className="tw-flex tw-h-full tw-flex-row tw-overflow-hidden">
                <Flow />
            </div>
        </div>
    );
};
