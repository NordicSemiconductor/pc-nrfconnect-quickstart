/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import { Choice } from '../features/device/deviceGuides';
import { startWatchingDevices } from '../features/device/deviceLib';
import { addDevice, removeDevice } from '../features/device/deviceSlice';
import Apps from '../features/steps/Apps';
import Connect from '../features/steps/Connect';
import Develop from '../features/steps/Develop';
import Finish from '../features/steps/Finish';
import Introduction from '../features/steps/Introduction';
import Learn from '../features/steps/Learn';
import Personalize from '../features/steps/Personalize';
import Program from '../features/steps/Program';
import SelectFirmware from '../features/steps/SelectFirmware';
import { getCurrentStep, Step } from '../features/steps/stepsSlice';
import Welcome from '../features/steps/Welcome';
import { useAppDispatch, useAppSelector } from './store';

import './App.scss';

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

    const [choice, setChoice] = useState<Choice>();
    const currentStep = useAppSelector(getCurrentStep);

    return (
        <>
            {currentStep === Step.WELCOME && <Welcome />}
            {currentStep === Step.CONNECT && <Connect />}
            {currentStep === Step.INTRODUCTION && <Introduction />}
            {currentStep === Step.PERSONALIZE && <Personalize />}
            {currentStep === Step.SELECT_FIRMWARE && (
                <SelectFirmware selectChoice={setChoice} />
            )}
            {currentStep === Step.PROGRAM && (
                <Program
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice
                    selectedFirmware={choice!.firmware}
                    selectChoice={setChoice}
                />
            )}
            {currentStep === Step.APPS && <Apps />}
            {currentStep === Step.LEARN && <Learn />}
            {currentStep === Step.DEVELOP && <Develop />}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice */}
            {currentStep === Step.FINISH && <Finish choice={choice!} />}
        </>
    );
};
