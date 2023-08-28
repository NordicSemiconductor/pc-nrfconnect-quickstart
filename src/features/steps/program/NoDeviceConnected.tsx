/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import Heading from '../../../common/Heading';
import Main from '../../../common/Main';
import { selectedDeviceIsConnected } from '../../device/deviceSlice';
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
            <Main.Content>
                <Heading>Device not connected</Heading>
                <div className="tw-flex tw-max-w-sm tw-flex-col tw-items-center tw-gap-4 tw-pt-4">
                    <Spinner size="sm" />
                    <p>
                        Ensure that your device is connected in order to program
                        it
                    </p>
                </div>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
