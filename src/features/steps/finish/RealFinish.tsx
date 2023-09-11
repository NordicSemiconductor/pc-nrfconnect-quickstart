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

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';

export default ({ back }: { back: () => void }) => {
    const deviceName = deviceInfo(
        useAppSelector(getSelectedDeviceUnsafely)
    ).name;

    return (
        <Main>
            <Main.Content
                heading="Thank you"
                subHeading={`You completed all steps for the ${deviceName}`}
            >
                <div className="tw-flex tw-flex-col">
                    <span className="mdi mdi-flag-checkered tw-text-8xl tw-leading-none tw-text-gray-700" />
                </div>
            </Main.Content>
            <Main.Footer>
                <Back onClick={back} />
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
