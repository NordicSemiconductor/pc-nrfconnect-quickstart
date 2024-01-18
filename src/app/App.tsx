/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { logger, usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { setNrfutilLogger } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Steps from '../features/steps';
import Header from './Header';
import StepStepper from './StepStepper';
import { useAppDispatch } from './store';

import './App.scss';

usageData.enableTelemetry();

const useDevicesInStore = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const stopWatchingDevicesPromise = startWatchingDevices(
            device => dispatch(addDevice(device)),
            deviceId => dispatch(removeDevice(deviceId))
        );

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
    }, []);
    useDevicesInStore();

    return (
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
            <Header />
            <div className="tw-flex tw-h-full tw-flex-row tw-overflow-hidden">
                <StepStepper />
                <div className="tw-flex-1">
                    <Steps />
                </div>
            </div>
        </div>
    );
};
