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
import Develop from '../features/steps/Develop';
import Evaluate from '../features/steps/Evaluate';
import Finish from '../features/steps/finish';
import Learn from '../features/steps/Learn';
import Present from '../features/steps/Present';
import Program from '../features/steps/program';
import Rename from '../features/steps/Rename';
import { getCurrentStep } from '../features/steps/stepsSlice';
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
                    {currentStep === 'Present' && <Present />}
                    {currentStep === 'Rename' && <Rename />}
                    {currentStep === 'Program' && <Program />}
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
