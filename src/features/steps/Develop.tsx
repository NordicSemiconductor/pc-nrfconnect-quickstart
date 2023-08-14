/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
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
                <Heading>Install nRF Connect SDK and Toolchain</Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                    <p>
                        The nRF Connect SDK is where you begin building
                        low-power wireless applications with Nordic
                        Semiconductor.
                    </p>
                    <p>
                        The Toolchain Manager app is used to install and manage
                        IDE, SDK, Toolchain and dependencies.
                    </p>
                    <p>
                        Launch the app and install the latest version. Follow
                        the instructions in the Toolchain Manager app to
                        complete the setup of Ide, SDK and Toolchain.
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next
                    label="Launch Toolchain Manager"
                    onClick={next => {
                        openWindow.openApp({
                            name: 'pc-nrfconnect-toolchain-manager',
                            source: 'official',
                        });

                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};