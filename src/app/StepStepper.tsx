/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { getCurrentStep } from '../features/steps/stepsSlice';
import { useAppSelector } from './store';

export default () => {
    const currentStep = useAppSelector(getCurrentStep);

    return <div />;
};
