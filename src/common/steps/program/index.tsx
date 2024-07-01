/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import NoDeviceConnected from '../../NoDeviceConnected';
import Error from './Error';
import Program from './Program';
import { startProgramming } from './programEffects';
import { Choice, getProgrammingState, ProgrammingState } from './programSlice';
import SelectFirmware from './SelectFirmware';
import Success from './Success';

const ProgramStep = ({ choices }: { choices: Choice[] }) => {
    const programmingState = useAppSelector(getProgrammingState);
    const dispatch = useAppDispatch();

    return (
        <>
            {programmingState === ProgrammingState.SELECT_FIRMWARE && (
                <SelectFirmware choices={choices} />
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

export default (choices: Choice[]) => ({
    name: 'Program',
    component: () => ProgramStep({ choices }),
});
