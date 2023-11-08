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
    const step = useAppSelector(getCurrentStep);

    // Telemetry when user changes step
    useEffect(() => {
        usageData.sendUsageData('Changed step', { step });
    }, [step]);

    return (
        <>
            {step === 'info' && <Info />}
            {step === 'rename' && <Rename />}
            {step === 'program' && <Program />}
            {step === 'verify' && <Verify />}
            {step === 'sim' && <SimCardActivation />}
            {step === 'evaluate' && <Evaluate />}
            {step === 'develop' && <Develop />}
            {step === 'learn' && <Learn />}
            {step === 'apps' && <Apps />}
            {step === 'finish' && <Finish />}
        </>
    );
};
