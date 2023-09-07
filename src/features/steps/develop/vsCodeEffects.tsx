/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { app } from '@electron/remote';

import { AppDispatch } from '../../../app/store';
import { setIsVsCodeInstalled } from './developSlice';

export const detectVsCode = (dispatch: AppDispatch) => {
    dispatch(
        setIsVsCodeInstalled(
            app.getApplicationNameForProtocol('vscode://') !== ''
        )
    );
};
