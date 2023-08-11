/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../app/store';
import { DeviceIcon, deviceName } from '../features/device/deviceGuides';
import {
    getSelectedDeviceUnsafely,
    selectDevice,
} from '../features/device/deviceSlice';
import { Back } from './Back';
import Heading from './Heading';
import Main from './Main';
import { Next } from './Next';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main device={device}>
            <Main.Content>
                <div className="tw-pb-10">
                    <DeviceIcon
                        device={device}
                        className="tw-h-14 tw-w-20 tw-fill-gray-700"
                    />
                </div>
                <Heading>
                    Let&apos;s get started with the {deviceName(device)}
                </Heading>
                <div className="tw-max-w-sm tw-pt-10">
                    <p>\\Device capabilities//</p>
                </div>
            </Main.Content>
            <Main.Footer className="tw-gap-20">
                <Back
                    onClick={back => {
                        back();
                        dispatch(selectDevice(undefined));
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
