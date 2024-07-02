/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import { useAppDispatch } from '../../../app/store';
import { setFinishedLastStep } from '../flowSlice';
import Feedback from './Feedback';
import Finish from './Finish';
import RealFinish from './RealFinish';

enum SubSteps {
    FINISH,
    FEEDBACK,
    REAL_FINISH,
}

const FinishStep = () => {
    const dispatch = useAppDispatch();
    const [currentSubStep, setCurrentSubStep] = useState(SubSteps.FINISH);

    return (
        <>
            {currentSubStep === SubSteps.FINISH && (
                <Finish next={() => setCurrentSubStep(SubSteps.FEEDBACK)} />
            )}
            {currentSubStep === SubSteps.FEEDBACK && (
                <Feedback
                    back={() => setCurrentSubStep(SubSteps.FINISH)}
                    next={() => {
                        dispatch(setFinishedLastStep(true));
                        setCurrentSubStep(SubSteps.REAL_FINISH);
                    }}
                />
            )}
            {currentSubStep === SubSteps.REAL_FINISH && (
                <RealFinish
                    back={() => {
                        dispatch(setFinishedLastStep(false));
                        setCurrentSubStep(SubSteps.FINISH);
                    }}
                />
            )}
        </>
    );
};

export default () => ({
    name: 'Finish',
    component: FinishStep,
});
