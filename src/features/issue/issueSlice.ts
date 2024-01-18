/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { ReactNode } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

export interface Issue {
    level: 'error' | 'warning';
    issueContent: ReactNode | string;
    solutionContent?: ReactNode | string;
}

interface State {
    issue?: Issue;
}

const initialState: State = {
    issue: undefined,
};

const slice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        setIssue: (state, { payload: issue }: PayloadAction<Issue>) => {
            state.issue = issue;
        },

        clearIssue: state => {
            state.issue = undefined;
        },
    },
});

export const { setIssue, clearIssue } = slice.actions;
export default slice.reducer;

export const getIssue = (state: RootState) => state.issue.issue;
