/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { openUrl, usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';

import logo from '../../../../resources/nrf_connect_for_vs_code.svg';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import {
    DevelopState,
    getIsVsCodeInstalled,
    setDevelopState,
} from './developSlice';
import { detectVsCodeRepeatedly } from './vsCodeEffects';
import VsCodeNotInstalled from './VsCodeNotInstalled';

export default () => {
    const dispatch = useAppDispatch();
    const isVsCodeInstalled = useAppSelector(getIsVsCodeInstalled);

    useEffect(
        () => detectVsCodeRepeatedly(dispatch, isVsCodeInstalled),
        [dispatch, isVsCodeInstalled]
    );

    if (!isVsCodeInstalled) {
        return <VsCodeNotInstalled />;
    }

    return (
        <Main>
            <Main.Content heading="Open VS Code">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-6">
                    <img src={logo} alt="" className="tw-h-12" />
                    <p>
                        Nordic Semiconductor&apos;s nRF Connect for VS Code
                        extension enhances the development experience for all
                        aspects of the nRF Connect SDK application development
                        in VS Code.
                    </p>
                    <p>
                        Click to open VS Code and install the nRF Connect for VS
                        Code extension. Follow the instructions in the extension
                        to install the toolchain and the SDK, and start
                        developing.
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setDevelopState(DevelopState.CHOOSE));
                    }}
                />
                <Skip />
                <Next
                    label="Open VS Code with extension"
                    onClick={() => {
                        openUrl(
                            'vscode://nordic-semiconductor.nrf-connect-extension-pack/quickstart'
                        );

                        dispatch(setDevelopState(DevelopState.VS_CODE_OPENED));
                        usageData.sendUsageData('Opened VS Code');
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
