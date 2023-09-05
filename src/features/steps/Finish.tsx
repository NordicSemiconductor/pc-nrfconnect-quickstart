/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import {
    deviceInfo,
    openWindow,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Italic from '../../common/Italic';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const deviceName = deviceInfo(
        useAppSelector(getSelectedDeviceUnsafely)
    ).name;

    return (
        <Main>
            <Main.Content
                heading="Finish"
                subHeading={`You completed all steps for the ${deviceName}`}
            >
                <div className="tw-pb-10">
                    <span className="mdi mdi-flag-checkered tw-text-8xl tw-leading-none tw-text-gray-700" />
                </div>
                <Italic>Did you find the information you expected?</Italic>
                <br />
                <Italic>Was something unclear?</Italic>
                <br />
                <Italic>Is there something we missed?</Italic>
                <br />
                <br />
                <b>
                    <u>Give feedback</u>
                </b>{' '}
                now and help us improve the user experience.
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next
                    label="Close"
                    onClick={() => {
                        usageData.sendUsageData('Exit quickstart');
                        openWindow.openLauncher();
                        getCurrentWindow().close();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
