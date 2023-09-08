/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import Choose from './Choose';
import CLI from './CLI';
import { DevelopState, getDevelopState } from './developSlice';
import OpenVsCode from './OpenVsCode';
import VsCodeOpened from './VsCodeOpened';

export default () => {
    const developState = useAppSelector(getDevelopState);

    return (
        <>
            {developState === DevelopState.CHOOSE && <Choose />}
            {developState === DevelopState.OPEN_VS_CODE && <OpenVsCode />}
            {developState === DevelopState.VS_CODE_OPENED && <VsCodeOpened />}
            {developState === DevelopState.CLI && <CLI />}
        </>
    );
};
