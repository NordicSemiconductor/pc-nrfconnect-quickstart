/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State } from './store';

interface Choice {
    name: string;
    firmware: { format: string; file: string }[];
}
interface ChoiceState {
    selectedChoice: Choice | undefined;
}

const initialState: ChoiceState = {
    selectedChoice: undefined,
};

const slice = createSlice({
    name: 'choice',
    initialState,
    reducers: {
        setSelectedChoice: (state, action: PayloadAction<Choice>) => {
            state.selectedChoice = action.payload;
        },
        deselectChoice: state => {
            state.selectedChoice = undefined;
        },
    },
});

export const getSelectedChoice = (state: State) => state.choice.selectedChoice;

export const {
    actions: { setSelectedChoice, deselectChoice },
    reducer,
} = slice;
