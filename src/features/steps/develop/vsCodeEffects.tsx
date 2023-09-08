/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { app } from '@electron/remote';

import { AppDispatch } from '../../../app/store';
import { setIsVsCodeInstalled } from './developSlice';

const isVsCodeInstalled = () =>
    app.getApplicationNameForProtocol('vscode://') !== '';

export const detectVsCode = (dispatch: AppDispatch) => {
    dispatch(setIsVsCodeInstalled(isVsCodeInstalled()));
};

export const detectVsCodeRepeatedly = (dispatch: AppDispatch) => {
    const id = setInterval(() => {
        if (isVsCodeInstalled()) {
            dispatch(setIsVsCodeInstalled(true));
            clearInterval(id);
        }
    }, 100);

    return () => clearInterval(id);
};
