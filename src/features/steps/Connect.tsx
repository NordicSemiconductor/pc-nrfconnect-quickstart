/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import Main from '../../common/Main';
import { isSupportedDevice } from '../device/deviceGuides';
import { getConnectedDevices, selectDevice } from '../device/deviceSlice';
import { goToNextStep } from './stepsSlice';

export default () => {
    const dispatch = useAppDispatch();
    const supportedDevices =
        useAppSelector(getConnectedDevices).filter(isSupportedDevice);

    const [longSearchDuration, setLongSearchDuration] = useState(false);
    const [hasWaitedMinDuration, setHasWaitedMinDuration] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasWaitedMinDuration(true);
        }, 3000);
    }, []);

    useEffect(() => {
        if (hasWaitedMinDuration && supportedDevices.length) {
            dispatch(selectDevice(supportedDevices[0]));
            dispatch(goToNextStep());
        }
    }, [hasWaitedMinDuration, supportedDevices, dispatch]);

    useEffect(() => {
        if (supportedDevices.length) {
            setLongSearchDuration(false);
            return;
        }

        const timeout = setTimeout(() => {
            setLongSearchDuration(true);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [supportedDevices]);

    return (
        <Main>
            <Main.Content heading="Connect a Nordic kit to your PC">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4">
                    <Spinner size="sm" />
                    <p>Searching for devices</p>
                    {longSearchDuration && (
                        <div>
                            <p>This is taking a while.</p>
                            <p>
                                Make sure one of the supported devices is
                                connected: nRF9160DK
                            </p>
                            <p>
                                {' '}
                                If this persists, contact support on{' '}
                                <b>
                                    <u>DevZone</u>
                                </b>
                            </p>
                        </div>
                    )}
                </div>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
