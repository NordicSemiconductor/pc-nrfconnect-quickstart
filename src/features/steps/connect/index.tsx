/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../../app/store';
import { getConnectedDevices } from '../../device/deviceSlice';
import Detect from './Detect';
import Select from './Select';

let isFirstEnumeration = true;
export default () => {
    const connectedDevices = useAppSelector(getConnectedDevices);
    const [hasWaitedMinDuration, setHasWaitedMinDuration] = useState(
        !isFirstEnumeration
    );

    useEffect(() => {
        if (!hasWaitedMinDuration) {
            setTimeout(() => setHasWaitedMinDuration(true), 3000);
        }
        isFirstEnumeration = false;
    }, [hasWaitedMinDuration]);

    if (!connectedDevices.length || !hasWaitedMinDuration) {
        return <Detect />;
    }

    return <Select />;
};
