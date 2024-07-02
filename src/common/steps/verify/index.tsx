/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import { selectedDeviceIsConnected } from '../../../features/device/deviceSlice';
import NoDeviceConnected from '../../NoDeviceConnected';
import Verification, { Command } from './Verification';

const VerificationStep = ({ commands }: { commands: Command[] }) => {
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);

    return deviceIsConnected ? (
        <Verification commands={commands} />
    ) : (
        <NoDeviceConnected />
    );
};

export default (commands: Command[]) => ({
    name: 'Verify',
    component: () => VerificationStep({ commands }),
});
