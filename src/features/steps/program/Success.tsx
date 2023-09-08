/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { ProgrammingState, setProgrammingState } from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Programming successful">
                <ProgressIndicators />
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(
                            setProgrammingState(
                                ProgrammingState.SELECT_FIRMWARE
                            )
                        );
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
