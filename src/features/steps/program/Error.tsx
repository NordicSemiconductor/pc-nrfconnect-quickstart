/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    describeError,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { startProgramming } from './programEffects';
import {
    getProgrammingError,
    getProgrammingProgress,
    ProgrammingState,
    setProgrammingState,
} from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(getProgrammingError);
    const failedCore = useAppSelector(getProgrammingProgress).find(
        p => (p.progress?.totalProgressPercentage || 0) < 100
    )?.core;

    return (
        <Main>
            <Main.Content heading="Programming failed">
                <ProgressIndicators />
                <div className="tw-pt-10">
                    <p>
                        Failed to program
                        {failedCore ? ` ${failedCore} core` : ''}.
                    </p>
                    <br />
                    <p>{describeError(error)}</p>
                    <br />
                    <p>
                        Contact support on <DevZoneLink /> if problem persists.
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(
                            setProgrammingState(
                                ProgrammingState.SELECT_FIRMWARE
                            )
                        );
                    }}
                />
                <Button
                    variant="primary"
                    size="xl"
                    onClick={() => dispatch(startProgramming())}
                >
                    Program
                </Button>
            </Main.Footer>
        </Main>
    );
};
