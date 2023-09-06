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
import VsCode from './VsCode';

export default () => {
    const developState = useAppSelector(getDevelopState);

    return (
        <>
            {developState === DevelopState.CHOOSE && <Choose />}
            {developState === DevelopState.VS_CODE && <VsCode />}
            {developState === DevelopState.CLI && <CLI />}
        </>
    );
};
