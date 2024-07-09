/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from '@reduxjs/toolkit';

import type { AppThunk } from '../../app/store';
import { setChoice } from '../../features/device/deviceSlice';
import { setFinishedLastStep } from '../../features/flow/flowSlice';
import develop, { reset as developReset } from './develop/developSlice';
import program, { reset as programReset } from './program/programSlice';
import verification, {
    reset as verificationReset,
} from './verify/verificationSlice';

export const allReset = (): AppThunk => dispatch => {
    dispatch(setChoice(undefined));
    dispatch(programReset());
    dispatch(verificationReset());
    dispatch(developReset());
    dispatch(setFinishedLastStep(false));
};

export default combineReducers({ verification, develop, program });
