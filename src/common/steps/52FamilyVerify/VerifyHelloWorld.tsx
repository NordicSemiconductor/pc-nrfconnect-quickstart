/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';

import { useAppSelector } from '../../../app/store';
import { getSelectedDeviceUnsafely } from '../../../features/device/deviceSlice';
import runVerification from './serialport';

export default ({ portIndex }: { portIndex: number }) => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    useEffect(() => {
        const path = device.serialPorts?.[portIndex].comName;
        if (path) {
            runVerification(path);
        }
    }, [device, portIndex]);

    return (
        <p>
            Trying to verify device on port{' '}
            {device.serialPorts?.[portIndex].comName}
        </p>
    );
};
