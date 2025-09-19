/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';
import { setChoice } from '../../device/deviceSlice';

interface State {
    attestationToken?: string;
    failed: boolean;
}

const initialState: State = {
    attestationToken: undefined,
    failed: false,
};

const slice = createSlice({
    name: 'thingy91x',
    initialState,
    reducers: {
        setAttestationToken: (
            state,
            { payload: attestationToken }: PayloadAction<string>
        ) => {
            state.attestationToken = attestationToken;
        },
        setFailed: (state, { payload: failed }: PayloadAction<boolean>) => {
            state.failed = failed;
        },

        reset: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(setChoice, () => initialState);
    },
});

export const { setAttestationToken, setFailed, reset } = slice.actions;

export const getAttestationToken = (state: RootState) =>
    state.flows.thingy91x.attestationToken;
export const getFailed = (state: RootState) => state.flows.thingy91x.failed;

export default slice.reducer;
