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
import Finish from '../features/steps/Finish';
import Introduction from '../features/steps/Introduction';
import Learn from '../features/steps/Learn';
import Personalize from '../features/steps/Personalize';
import Program from '../features/steps/program';
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
                    {currentStep === 'Introduction' && <Introduction />}
                    {currentStep === 'Personalize' && <Personalize />}
                    {currentStep === 'Program' && <Program />}
                    {currentStep === 'Apps' && <Apps />}
                    {currentStep === 'Learn' && <Learn />}
                    {currentStep === 'Develop' && <Develop />}
                    {currentStep === 'Finish' && <Finish />}
                </div>
            </div>
        </div>
    );
};
