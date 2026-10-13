/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from '@reduxjs/toolkit';

import type { AppThunk } from '../../app/store';
import nrfCloudOnboarding, {
    reset as nrfCloudOnboardingReset,
} from '../../common/steps/NrfCloudOnboarding/onboardingSlice';
import nrf54l15Cloud, {
    reset as nrf54l15CloudReset,
} from './nRF54L15_cloud/evaluate/cloudEvaluateSlice';
import nrf93m1, { reset as nrf93m1Reset } from './nRF93M1/nrf93m1Slice';
import nrf9161, { reset as nrf9161Reset } from './nRF9161/nrf9161Slice';

export const allReset = (): AppThunk => dispatch => {
    dispatch(nrfCloudOnboardingReset());
    dispatch(nrf9161Reset());
    dispatch(nrf54l15CloudReset());
    dispatch(nrf93m1Reset());
};

export default combineReducers({
    nrfCloudOnboarding,
    nrf9161,
    nrf54l15Cloud,
    nrf93m1,
});
