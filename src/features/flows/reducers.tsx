/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from '@reduxjs/toolkit';

import type { AppThunk } from '../../app/store';
import nrf9151, { reset as nrf9151Reset } from './nRF9151/nrf9151Slice';
import nrf9161, { reset as nrf9161Reset } from './nRF9161/nrf9161Slice';

export const allReset = (): AppThunk => dispatch => {
    dispatch(nrf9151Reset());
    dispatch(nrf9161Reset());
};

export default combineReducers({
    nrf9151,
    nrf9161,
});
