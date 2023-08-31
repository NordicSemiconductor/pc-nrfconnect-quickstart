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
import { setChoice } from '../../device/deviceSlice';
import { ProgrammingState, setProgrammingState } from './programSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Success!">
                <div className="tw-max-w-sm tw-pt-10">
                    <p>Device was programmed successfully.</p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setChoice(undefined));
                        setProgrammingState(ProgrammingState.SELECT_FIRMWARE);
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
