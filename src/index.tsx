/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import Apps from './components/Apps';
import Develop from './components/Develop';
import Evaluate from './components/Evaluate';
import Finish from './components/Finish';
import Introduction from './components/Introduction';
import Learn from './components/Learn';
import Personalize from './components/Personalize';
import Welcome from './components/Welcome';

import './index.scss';

enum Steps {
    WELCOME,
    INTRODUCTION,
    PERSONALIZE,
    EVALUATE,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

export default () => {
    const [currentStep, setCurrentStep] = useState(
        Steps.WELCOME
        // '--first-launch' ? Steps.WELCOME : Steps.DETECT
    );

    const props = {
        back: () => {
            setCurrentStep(Math.max(Steps.WELCOME, currentStep - 1));
        },
        next: () => {
            setCurrentStep(Math.min(Steps.FINISH, currentStep + 1));
        },
    };

    return (
        <>
            {currentStep === Steps.WELCOME && <Welcome {...props} />}
            {currentStep === Steps.INTRODUCTION && <Introduction {...props} />}
            {currentStep === Steps.PERSONALIZE && <Personalize {...props} />}
            {currentStep === Steps.EVALUATE && <Evaluate {...props} />}
            {currentStep === Steps.APPS && <Apps {...props} />}
            {currentStep === Steps.LEARN && <Learn {...props} />}
            {currentStep === Steps.DEVELOP && <Develop {...props} />}
            {currentStep === Steps.FINISH && <Finish {...props} />}
        </>
    );
};
