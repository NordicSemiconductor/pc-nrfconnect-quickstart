/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import Apps from './Apps';
import Develop from './develop';
import Evaluate from './Evaluate';
import Finish from './finish';
import Info from './Info';
import Learn from './Learn';
import Program from './program';
import Rename from './Rename';
import SimCardActivation from './simCardActivation';
import { getCurrentStep } from './stepsSlice';
import Verify from './verify';

export default () => {
    const currentStep = useAppSelector(getCurrentStep);

    // Telemetry when user changes step
    useEffect(() => {
        usageData.sendUsageData(`Step: ${currentStep}`);
    }, [currentStep]);

    return (
        <>
            {currentStep === 'info' && <Info />}
            {currentStep === 'rename' && <Rename />}
            {currentStep === 'program' && <Program />}
            {currentStep === 'verify' && <Verify />}
            {currentStep === 'sim' && <SimCardActivation />}
            {currentStep === 'evaluate' && <Evaluate />}
            {currentStep === 'develop' && <Develop />}
            {currentStep === 'learn' && <Learn />}
            {currentStep === 'apps' && <Apps />}
            {currentStep === 'finish' && <Finish />}
        </>
    );
};
