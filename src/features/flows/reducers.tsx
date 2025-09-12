/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from '@reduxjs/toolkit';

import type { AppThunk } from '../../app/store';
import nrf9161, { reset as nrf9161Reset } from './nRF9161/nrf9161Slice';

export const allReset = (): AppThunk => dispatch => {
    dispatch(nrf9161Reset());
};

export default combineReducers({
    nrf9161,
});
