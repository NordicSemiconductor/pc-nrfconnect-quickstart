/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import NoDeviceConnected from '../../../common/NoDeviceConnected';
import { selectedDeviceIsConnected } from '../../device/deviceSlice';
import Verification from './Verification';

export default () => {
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);

    return deviceIsConnected ? <Verification /> : <NoDeviceConnected />;
};
