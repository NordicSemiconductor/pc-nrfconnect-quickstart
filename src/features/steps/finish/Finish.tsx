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
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Italic from '../../../common/Italic';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';

export default ({ next }: { next: () => void }) => {
    const deviceName = deviceInfo(
        useAppSelector(getSelectedDeviceUnsafely)
    ).name;

    return (
        <Main>
            <Main.Content
                heading="Finish"
                subHeading={`You completed all steps for the ${deviceName}`}
            >
                <div className="tw-flex tw-flex-col">
                    <span className="mdi mdi-flag-checkered tw-text-8xl/[6rem] tw-text-gray-700" />
                    <div className="tw-pt-10">
                        <Italic>
                            Did you find the information you expected?
                        </Italic>
                        <br />
                        <Italic>Was something unclear?</Italic>
                        <br />
                        <Italic>Is there something missing?</Italic>
                        <br />
                        <br />
                        Give feedback now and help us improve the user
                        experience.
                    </div>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                {/* Using Back button here simply for the styling */}
                <Back label="Give feedback" onClick={next} />
                <Next
                    label="Close"
                    onClick={() => {
                        telemetry.sendEvent('Exit quick start');
                        openWindow.openLauncher();
                        getCurrentWindow().close();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
