/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { getSelectedDeviceUnsafely, setChoice } from '../../device/deviceSlice';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main device={device}>
            <Main.Content heading="Success!">
                <div className="tw-max-w-sm">
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
