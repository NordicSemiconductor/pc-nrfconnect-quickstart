/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import activityBarImage from '../../../../resources/vs_code_activity_bar.png';
import { useAppDispatch } from '../../../app/store';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next } from '../../Next';
import { DevelopState, setDevelopState } from './developSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content
                heading="nRF Connect for VS Code extension"
                subHeading="The extension is located in the VS Code activity bar"
            >
                <div className="tw-flex">
                    <img
                        src={activityBarImage}
                        alt="VS Code activity bar with the nRF Connect icon higlighted"
                    />
                    <div className="tw-relative">
                        <span className="mdi mdi-arrow-left-thick tw-absolute tw-top-[127px] tw-text-3xl" />
                    </div>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setDevelopState(DevelopState.OPEN_VS_CODE));
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
