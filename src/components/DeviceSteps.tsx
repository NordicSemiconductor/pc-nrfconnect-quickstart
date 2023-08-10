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
import {
    getCurrentStep,
    goToNextStep,
    goToPreviousStep,
    Step,
} from '../features/steps/stepsSlice';
import Apps from './Apps';
import Develop from './Develop';
import Evaluate from './Evaluate';
import Finish from './Finish';
import Introduction from './Introduction';
import Learn from './Learn';
import Personalize from './Personalize';

export default () => {
    const dispatch = useAppDispatch();
    const [choice, setChoice] = useState<Choice>();
    const currentStep = useAppSelector(getCurrentStep);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Because one cannot progress here without selecting a device, we are sure it is defined
    const device = useAppSelector(getSelectedDevice)!;

    const props = useMemo(
        () => ({
            device,
            back: () => {
                if (currentStep === Step.INTRODUCTION) {
                    dispatch(selectDevice(undefined));
                }
                dispatch(goToPreviousStep());
            },
            next: () => {
                dispatch(goToNextStep());
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
            {currentStep === Step.INTRODUCTION && <Introduction {...props} />}
            {currentStep === Step.PERSONALIZE && <Personalize {...props} />}
            {currentStep === Step.EVALUATE && (
                <Evaluate {...props} selectChoice={setChoice} />
            )}
            {currentStep === Step.APPS && <Apps {...props} />}
            {currentStep === Step.LEARN && <Learn {...props} />}
            {currentStep === Step.DEVELOP && <Develop {...props} />}
            {currentStep === Step.FINISH && (
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
