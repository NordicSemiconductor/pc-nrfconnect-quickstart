/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import NoticeBox from '../../../common/NoticeBox';
import { resetDevice, startProgramming } from './programEffects';
import {
    getProgrammingProgress,
    ProgrammingState,
    setProgrammingState,
} from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();
    const failedCore = useAppSelector(getProgrammingProgress).find(
        p => (p.progress?.totalProgressPercentage || 0) < 100
    )?.core;
    const resetFailed = !failedCore;

    return (
        <Main>
            <Main.Content heading="Programming failed">
                <ProgressIndicators />
                <div className="tw-pt-8">
                    <NoticeBox
                        mdiIcon={
                            resetFailed
                                ? 'mdi-restore-alert'
                                : 'mdi-flash-alert-outline'
                        }
                        color="tw-text-red"
                        title={
                            resetFailed
                                ? 'Failed to reset the device'
                                : `Failed to program the ${failedCore} core`
                        }
                    />
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
                <Next
                    label={resetFailed ? 'Reset' : 'Retry'}
                    onClick={() => {
                        if (resetFailed) {
                            dispatch(resetDevice());
                        } else {
                            dispatch(startProgramming());
                        }
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
