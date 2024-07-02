/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../../app/store';

export enum DevelopState {
    CHOOSE,
    OPEN_VS_CODE,
    VS_CODE_OPENED,
    CLI,
}

interface State {
    developState: DevelopState;
    isVsCodeInstalled: boolean;
}

const initialState: State = {
    developState: DevelopState.CHOOSE,
    isVsCodeInstalled: false,
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
        setIsVsCodeInstalled: (
            state,
            { payload: isVsCodeInstalled }: PayloadAction<boolean>
        ) => {
            state.isVsCodeInstalled = isVsCodeInstalled;
        },

        reset: () => initialState,
    },
});

export const { setDevelopState, setIsVsCodeInstalled, reset } = slice.actions;

export const getDevelopState = (state: RootState) =>
    state.steps.develop.developState;
export const getIsVsCodeInstalled = (state: RootState) =>
    state.steps.develop.isVsCodeInstalled;

export default slice.reducer;
