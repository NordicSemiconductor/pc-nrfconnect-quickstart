/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    getPersistedNickname,
    persistNickname,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { getSelectedDeviceUnsafely } from '../../features/device/deviceSlice';
import { Back } from '../Back';
import Main from '../Main';
import { Next, Skip } from '../Next';

const RenameStep = () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const previousNickname = device
        ? getPersistedNickname(device.serialNumber)
        : '';

    const [nickname, setNickname] = React.useState(previousNickname);
    const maxLength = 20;

    return (
        <Main>
            <Main.Content heading="Give your kit a custom name">
                <div className="tw-flex tw-w-64 tw-flex-col tw-items-center">
                    <div className="tw-self-end tw-text-xs">{`${nickname.length}/${maxLength}`}</div>
                    <input
                        placeholder="Name your device"
                        type="text"
                        onChange={event => setNickname(event.target.value)}
                        value={nickname}
                        maxLength={maxLength}
                        className="tw-h-8 tw-w-full tw-border tw-border-solid tw-border-gray-300 tw-px-2 tw-py-4 focus:tw-outline-0"
                    />
                </div>
                <p className="tw-pt-12">
                    The application will remember and display the custom name
                    when you use other apps. You can always change the name
                    later. Click <b>Skip</b> if you prefer to keep the default
                    name.
                </p>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Skip />
                <Next
                    onClick={next => {
                        const newNickname = nickname.trim();
                        if (newNickname !== previousNickname) {
                            persistNickname(device.serialNumber, newNickname);
                            telemetry.sendEvent(
                                newNickname.length > 0
                                    ? 'Set device nickname'
                                    : 'Reset device nickname'
                            );
                        }

                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};

export default () => ({
    name: 'Rename',
    component: RenameStep,
});
