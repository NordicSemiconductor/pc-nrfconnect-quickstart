/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Apps from '../features/steps/Apps';
import Connect from '../features/steps/Connect';
import Develop from '../features/steps/Develop';
import Finish from '../features/steps/Finish';
import Introduction from '../features/steps/Introduction';
import Learn from '../features/steps/Learn';
import Personalize from '../features/steps/Personalize';
import Program from '../features/steps/program';
import SelectFirmware from '../features/steps/SelectFirmware';
import { getCurrentStep, Step } from '../features/steps/stepsSlice';
import { useAppDispatch, useAppSelector } from './store';

import './App.scss';

usageData.init({ name: 'pc-nrfconnect-quickstart ', version: '0.0.1' });

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
export const App = () => {
    useDevicesInStore();

    const currentStep = useAppSelector(getCurrentStep);

    // Telemetry when user changes step
    useEffect(() => {
        const currentStepName = Step[currentStep];
        usageData.sendUsageData(`Step ${currentStepName}`);
    }, [currentStep]);

    return (
        <>
            {currentStep === Step.CONNECT && <Connect />}
            {currentStep === Step.INTRODUCTION && <Introduction />}
            {currentStep === Step.PERSONALIZE && <Personalize />}
            {currentStep === Step.SELECT_FIRMWARE && <SelectFirmware />}
            {currentStep === Step.PROGRAM && <Program />}
            {currentStep === Step.APPS && <Apps />}
            {currentStep === Step.LEARN && <Learn />}
            {currentStep === Step.DEVELOP && <Develop />}
            {currentStep === Step.FINISH && <Finish />}
        </>
    );
};
