/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { PackageJson } from '@nordicsemiconductor/pc-nrfconnect-shared/ipc/MetaFiles';

import packageJson from '../../package.json';
import Connect from '../features/connect';
import { startWatchingDevices } from '../features/device/deviceLib';
import {
    addDevice,
    getSelectedDevice,
    removeDevice,
} from '../features/device/deviceSlice';
import Steps from '../features/steps';
import Header from './Header';
import StepStepper from './StepStepper';
import { useAppDispatch, useAppSelector } from './store';

import './App.scss';

usageData.init(packageJson as unknown as PackageJson);

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
    useDevicesInStore();

    const selectedDevice = useAppSelector(getSelectedDevice);

    return (
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
            <Header />
            <div className="tw-flex tw-h-full tw-flex-row tw-overflow-hidden">
                <StepStepper />
                <div className="tw-flex-1">
                    {selectedDevice ? <Steps /> : <Connect />}
                </div>
            </div>
        </div>
    );
};
