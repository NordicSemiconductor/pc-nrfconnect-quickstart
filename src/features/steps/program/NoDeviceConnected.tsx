/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { selectedDeviceIsConnected } from '../../device/deviceSlice';
import Searching from '../connect/Searching';
import { startProgramming } from './programEffects';

export default () => {
    const dispatch = useAppDispatch();
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);

    useEffect(() => {
        if (deviceIsConnected) {
            dispatch(startProgramming());
        }
    }, [deviceIsConnected, dispatch]);

    return (
        <Main>
            <Main.Content
                heading="No development kit detected"
                subHeading="Make sure you have a development kit connected."
            >
                <Searching />
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next disabled label="Program" />
            </Main.Footer>
        </Main>
    );
};
