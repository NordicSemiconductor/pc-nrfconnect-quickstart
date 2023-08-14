/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import { openWindow } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main device={device}>
            <Main.Content className="tw-max-w-sm">
                <Heading>Finished Quickstart</Heading>
                <div className="tw-flex tw-flex-col tw-gap-4 tw-pt-10">
                    <p>You now have finished all the steps</p>
                    <p>
                        Quickstart can be opened at any time from nRF Connect
                        for Desktop
                    </p>
                    <p>
                        Please leave{' '}
                        <u>
                            <strong>feedback</strong>
                        </u>{' '}
                        if you have suggestions for how we can make the getting
                        started experience better
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next
                    label="Exit and open nRF Connect for Desktop"
                    onClick={() => {
                        openWindow.openLauncher();
                        getCurrentWindow().close();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
