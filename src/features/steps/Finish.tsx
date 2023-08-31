/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import {
    openWindow,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';

export default () => (
    <Main>
        <Main.Content heading="Finished quickstart" className="tw-max-w-sm">
            <div className="tw-flex tw-flex-col tw-gap-4 tw-pt-10">
                <p>You now have finished all the steps</p>
                <p>
                    Quickstart can be opened at any time from nRF Connect for
                    Desktop
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
                label="Exit"
                onClick={() => {
                    usageData.sendUsageData('Exit quickstart');
                    openWindow.openLauncher();
                    getCurrentWindow().close();
                }}
            />
        </Main.Footer>
    </Main>
);
