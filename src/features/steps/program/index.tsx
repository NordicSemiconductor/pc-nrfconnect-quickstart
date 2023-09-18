/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import NoDeviceConnected from '../../../common/NoDeviceConnected';
import Error from './Error';
import Program from './Program';
import { startProgramming } from './programEffects';
import { getProgrammingState, ProgrammingState } from './programSlice';
import SelectFirmware from './SelectFirmware';
import Success from './Success';

export default () => {
    const programmingState = useAppSelector(getProgrammingState);
    const dispatch = useAppDispatch();

    return (
        <>
            {programmingState === ProgrammingState.SELECT_FIRMWARE && (
                <SelectFirmware />
            )}
            {programmingState === ProgrammingState.NO_DEVICE_CONNECTED && (
                <NoDeviceConnected
                    onDeviceConnected={() => dispatch(startProgramming())}
                />
            )}
            {programmingState === ProgrammingState.PROGRAMMING && <Program />}
            {programmingState === ProgrammingState.SUCCESS && <Success />}
            {programmingState === ProgrammingState.ERROR && <Error />}
        </>
    );
};
