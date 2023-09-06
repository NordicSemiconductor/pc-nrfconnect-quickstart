/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';

export enum DevelopState {
    CHOOSE,
    VS_CODE,
    CLI,
}

interface State {
    developState: DevelopState;
}

const initialState: State = {
    developState: DevelopState.CHOOSE,
};

const slice = createSlice({
    name: 'develop',
    initialState,
    reducers: {
        setDevelopState: (
            state,
            { payload: newState }: PayloadAction<DevelopState>
        ) => {
            state.developState = newState;
        },
    },
});

export const { setDevelopState } = slice.actions;

export const getDevelopState = (state: RootState) => state.develop.developState;

export default slice.reducer;
