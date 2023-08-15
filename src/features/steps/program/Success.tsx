/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch } from '../../../app/store';
import { Back } from '../../../common/Back';
import Heading from '../../../common/Heading';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { setChoice } from '../../device/deviceSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content>
                <Heading>Success!</Heading>
                <div className="tw-max-w-sm tw-pt-10">
                    <p>Device was programmed successfully.</p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={back => {
                        dispatch(setChoice(undefined));
                        back();
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
