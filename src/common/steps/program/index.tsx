/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../../app/store';
import { Choice } from '../../../features/device/deviceSlice';
import Program from './Program';
import { getProgrammingBatchLength } from './programSlice';
import SelectFirmware from './SelectFirmware';

const ProgramStep = ({ choices }: { choices: Choice[] }) => {
    const hasStartedProgramming = !!useAppSelector(getProgrammingBatchLength);

    return hasStartedProgramming ? (
        <Program />
    ) : (
        <SelectFirmware choices={choices} />
    );
};

export default (choices: Choice[]) => ({
    name: 'Program',
    component: () => ProgramStep({ choices }),
});
