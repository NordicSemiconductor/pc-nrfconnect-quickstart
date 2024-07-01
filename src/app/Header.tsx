/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    getPersistedNickname,
    Logo,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DeviceIcon, deviceName } from '../features/device/deviceGuides';
import { getSelectedDevice } from '../features/device/deviceSlice';
import { getCurrentStepIndex } from '../features/flow/flowSlice';
import { useAppSelector } from './store';

export default () => {
    const device = useAppSelector(getSelectedDevice);
    const reloadHeader = useAppSelector(getCurrentStepIndex);
    const [name, setName] = useState('');

    useEffect(() => {
        if (device) {
            setName(
                getPersistedNickname(device.serialNumber) ||
                    deviceName(device) ||
                    ''
            );
        }
    }, [device, reloadHeader]);

    return (
        <div className="tw-flex tw-h-14 tw-max-h-14 tw-min-h-[56px] tw-w-full tw-flex-row tw-items-center tw-justify-around tw-bg-primary tw-px-8 tw-text-base tw-text-white">
            <p className="tw-flex-1 tw-font-bold tw-uppercase">Quick Start</p>
            {device && (
                <div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
                    <DeviceIcon
                        device={device}
                        className="tw-h-5 tw-fill-white"
                    />
                    <p>{name}</p>
                </div>
            )}
            <div className="tw-flex tw-flex-1 tw-flex-row tw-justify-end">
                <div className="tw-w-10">
                    <Logo />
                </div>
            </div>
        </div>
    );
};
