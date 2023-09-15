/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';

import { useAppSelector } from '../app/store';
import { selectedDeviceIsConnected } from '../features/device/deviceSlice';
import Searching from '../features/steps/connect/Searching';
import { Back } from './Back';
import Main from './Main';
import { Next } from './Next';

export default ({ onDeviceConnected }: { onDeviceConnected?: () => void }) => {
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);

    useEffect(() => {
        if (deviceIsConnected && onDeviceConnected) {
            onDeviceConnected();
        }
    }, [deviceIsConnected, onDeviceConnected]);

    return (
        <Main>
            <Main.Content
                heading="No development kit detected"
                subHeading="Make sure you have a development kit connected."
            >
                <Searching />
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next disabled />
            </Main.Footer>
        </Main>
    );
};
