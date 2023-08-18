/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import Main from '../../../common/Main';
import {
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../device/deviceSlice';
import { startProgramming } from './programEffects';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);

    useEffect(() => {
        if (deviceIsConnected) {
            dispatch(startProgramming());
        }
    }, [deviceIsConnected, dispatch]);

    return (
        <Main device={device}>
            <Main.Content heading="Device not connected">
                <div className="tw-flex tw-max-w-sm tw-flex-col tw-items-center tw-gap-4">
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
