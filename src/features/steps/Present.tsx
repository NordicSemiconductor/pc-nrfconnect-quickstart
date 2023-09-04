/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import {
    deviceDescription,
    DeviceIcon,
    deviceName,
} from '../device/deviceGuides';
import { getSelectedDeviceUnsafely, selectDevice } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content
                heading={`Let's get started with the ${deviceName(device)}`}
            >
                <div className="tw-pb-10">
                    <DeviceIcon
                        device={device}
                        className="tw-h-14 tw-w-20 tw-fill-gray-700"
                    />
                </div>
                <div className="tw-max-w-sm tw-pt-10">
                    <p>{deviceDescription(device)}</p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={back => {
                        dispatch(selectDevice(undefined));
                        back();
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
