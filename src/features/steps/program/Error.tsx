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
import { Skip } from '../../../common/Next';
import { resetDevice, startProgramming } from './programEffects';
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
    const resetFailed = !failedCore;

    return (
        <Main>
            <Main.Content heading="Programming failed">
                <ProgressIndicators />
                <div className="tw-pt-8">
                    <p>
                        {resetFailed
                            ? 'Failed to reset device. '
                            : `Failed to program ${failedCore} core. `}
                        Contact support on <DevZoneLink /> if problem persists.
                    </p>
                    <br />
                    <p>{describeError(error)}</p>
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
                <Skip />
                <Button
                    variant="primary"
                    size="xl"
                    onClick={() => {
                        if (resetFailed) {
                            dispatch(resetDevice());
                        } else {
                            dispatch(startProgramming());
                        }
                    }}
                >
                    {resetFailed ? 'Reset' : 'Retry'}
                </Button>
            </Main.Footer>
        </Main>
    );
};
