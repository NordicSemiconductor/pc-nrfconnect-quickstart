/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import Welcome from './components/Welcome';

import './index.scss';

enum Steps {
    WELCOME,
}

export default () => {
    const [currentStep, setCurrentStep] = useState(
        Steps.WELCOME
        // '--first-launch' ? Steps.WELCOME : Steps.DETECT
    );
    const props = {
        back: () => {
            setCurrentStep(Math.max(0, currentStep - 1));
        },
        // next: () => {
        //     setCurrentStep(Math.min(Steps.FINISH, currentStep + 1));
        // },
    };
    return currentStep === Steps.WELCOME && <Welcome />;
};
