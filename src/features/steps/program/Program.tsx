/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import ProgressIndicators from './ProgressIndicators';

export default () => (
    <Main>
        <Main.Content heading="Programming">
            <ProgressIndicators />
        </Main.Content>
        <Main.Footer>
            <div className="tw-pr-4 tw-text-primary">
                <Spinner size="lg" />
            </div>
            <Back disabled />
            <Next disabled />
        </Main.Footer>
    </Main>
);
