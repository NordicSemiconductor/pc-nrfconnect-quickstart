/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { DeviceIcon, deviceName } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely, selectDevice } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const dispatch = useAppDispatch();

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
                        dispatch(selectDevice(undefined));
                        back();
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
