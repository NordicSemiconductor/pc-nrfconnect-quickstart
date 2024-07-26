/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import Program from './Program';
import { Choice, getProgrammingState, ProgrammingState } from './programSlice';
import SelectFirmware from './SelectFirmware';

const ProgramStep = ({ choices }: { choices: Choice[] }) => {
    const programmingState = useAppSelector(getProgrammingState);

    return programmingState === ProgrammingState.SELECT_FIRMWARE ? (
        <SelectFirmware choices={choices} />
    ) : (
        <Program />
    );
};

export default (choices: Choice[]) => ({
    name: 'Program',
    component: () => ProgramStep({ choices }),
});
