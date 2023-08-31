/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    getPersistedNickname,
    persistNickname,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    const [nickname, setNickname] = React.useState(
        device ? getPersistedNickname(device.serialNumber) : ''
    );
    const maxLength = 20;

    return (
        <Main>
            <Main.Content heading="First, give your kit a custom name">
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-12 tw-pt-10">
                    <div className="tw-flex tw-w-64 tw-flex-col tw-items-center">
                        <div className="tw-self-end tw-text-xs">{`${nickname.length}/${maxLength}`}</div>
                        <input
                            placeholder="Name your device"
                            onChange={event => setNickname(event.target.value)}
                            value={nickname}
                            maxLength={maxLength}
                            className="tw-h-8 tw-w-full tw-border tw-border-solid tw-border-gray-300 tw-px-2 tw-py-4 focus:tw-outline-0"
                        />
                    </div>
                    <p className="tw-max-w-sm">
                        We&apos;ll remember and display the custom name when you
                        use our apps. You can always change the name later.
                        Click skip if you prefer to keep the default name.
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <div className="tw-flex tw-flex-row tw-gap-2 tw-pl-20">
                    <Next label="Skip" variant="secondary" />
                    <Next
                        onClick={next => {
                            if (nickname.trim().length > 0 && device) {
                                persistNickname(device.serialNumber, nickname);
                                usageData.sendUsageData('Set device nickname');
                            }
                            next();
                        }}
                    />
                </div>
            </Main.Footer>
        </Main>
    );
};
