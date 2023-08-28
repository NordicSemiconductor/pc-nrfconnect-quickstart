/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import Error from './Error';
import NoDeviceConnected from './NoDeviceConnected';
import Program from './Program';
import { getProgrammingState, ProgrammingState } from './programSlice';
import SelectFirmware from './SelectFirmware';
import Success from './Success';

export default () => {
    const programmingState = useAppSelector(getProgrammingState);

    return (
        <>
            {programmingState === ProgrammingState.SELECT_FIRMWARE && (
                <SelectFirmware />
            )}
            {programmingState === ProgrammingState.NO_DEVICE_CONNECTED && (
                <NoDeviceConnected />
            )}
            {programmingState === ProgrammingState.PROGRAMMING && <Program />}
            {programmingState === ProgrammingState.SUCCESS && <Success />}
            {programmingState === ProgrammingState.ERROR && <Error />}
        </>
    );
};
