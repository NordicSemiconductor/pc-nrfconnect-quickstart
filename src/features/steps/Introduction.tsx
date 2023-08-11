/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';

import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { DeviceIcon, deviceName } from '../device/deviceGuides';
import Heading from './Heading';

export default ({ device }: { device: Device }) => (
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
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);
