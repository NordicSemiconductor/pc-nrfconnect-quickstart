/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { PackageJson } from '@nordicsemiconductor/pc-nrfconnect-shared/ipc/MetaFiles';

import packageJson from '../../package.json';
import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Apps from '../features/steps/Apps';
import Connect from '../features/steps/connect';
import Develop from '../features/steps/develop';
import Evaluate from '../features/steps/Evaluate';
import Finish from '../features/steps/finish';
import Info from '../features/steps/Info';
import Learn from '../features/steps/Learn';
import Program from '../features/steps/program';
import Rename from '../features/steps/Rename';
import { getCurrentStep } from '../features/steps/stepsSlice';
import Verify from '../features/steps/verify';
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

    const currentStep = useAppSelector(getCurrentStep);

    // Telemetry when user changes step
    useEffect(() => {
        usageData.sendUsageData(`Step: ${currentStep}`);
    }, [currentStep]);

    return (
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
            <Header />
            <div className="tw-flex tw-h-full tw-flex-row tw-overflow-hidden">
                <StepStepper />

                <div className="tw-flex-1">
                    {currentStep === 'Connect' && <Connect />}
                    {currentStep === 'Info' && <Info />}
                    {currentStep === 'Rename' && <Rename />}
                    {currentStep === 'Program' && <Program />}
                    {currentStep === 'Verify' && <Verify />}
                    {currentStep === 'Evaluate' && <Evaluate />}
                    {currentStep === 'Develop' && <Develop />}
                    {currentStep === 'Learn' && <Learn />}
                    {currentStep === 'Apps' && <Apps />}
                    {currentStep === 'Finish' && <Finish />}
                </div>
            </div>
        </div>
    );
};
