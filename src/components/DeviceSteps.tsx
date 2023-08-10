/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useMemo, useState } from 'react';
import { getCurrentWindow } from '@electron/remote';
import { openWindow } from 'pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../app/store';
import { Choice } from '../features/device/deviceGuides';
import {
    getSelectedDevice,
    selectDevice,
} from '../features/device/deviceSlice';
import { MainStep, setCurrentMainStep } from '../features/steps/stepsSlice';
import Apps from './Apps';
import Develop from './Develop';
import Evaluate from './Evaluate';
import Finish from './Finish';
import Introduction from './Introduction';
import Learn from './Learn';
import Personalize from './Personalize';

enum Steps {
    INTRODUCTION,
    PERSONALIZE,
    EVALUATE,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

export default () => {
    const dispatch = useAppDispatch();
    const [currentStep, setCurrentStep] = useState(Steps.INTRODUCTION);
    const [choice, setChoice] = useState<Choice>();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Because one cannot progress here without selecting a device, we are sure it is defined
    const device = useAppSelector(getSelectedDevice)!;

    const props = useMemo(
        () => ({
            device,
            back: () => {
                if (currentStep === Steps.INTRODUCTION) {
                    dispatch(selectDevice(undefined));
                    dispatch(setCurrentMainStep(MainStep.CONNECT));
                } else {
                    setCurrentStep(currentStep - 1);
                }
            },
            next: () => {
                setCurrentStep(Math.min(Steps.FINISH, currentStep + 1));
            },
            openApp: (app: string, serialNumber?: string) => {
                openWindow.openApp(
                    { name: app, source: 'official' },
                    serialNumber ? { device: { serialNumber } } : undefined
                );
            },
        }),
        [device, currentStep, dispatch]
    );

    return (
        <>
            {currentStep === Steps.INTRODUCTION && <Introduction {...props} />}
            {currentStep === Steps.PERSONALIZE && <Personalize {...props} />}
            {currentStep === Steps.EVALUATE && (
                <Evaluate {...props} selectChoice={setChoice} />
            )}
            {currentStep === Steps.APPS && <Apps {...props} />}
            {currentStep === Steps.LEARN && <Learn {...props} />}
            {currentStep === Steps.DEVELOP && <Develop {...props} />}
            {currentStep === Steps.FINISH && (
                <Finish
                    {...props}
                    finish={() => {
                        openWindow.openLauncher();
                        if (choice?.app) {
                            props.openApp(choice.app, device?.serialNumber);
                        }
                        getCurrentWindow().close();
                    }}
                />
            )}
        </>
    );
};
