/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useMemo } from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { selectedDeviceIsConnected } from '../../../features/device/deviceSlice';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next, Skip } from '../../Next';
import { InfoBox, IssueBox } from '../../NoticeBox';
import { resetDevice, startProgramming } from './programEffects';
import {
    getFirmwareNote,
    getProgrammingProgress,
    getProgrammingState,
    getResetProgress,
    ProgrammingState,
    ResetProgress,
    setProgrammingState,
} from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();
    const deviceConnected = useAppSelector(selectedDeviceIsConnected);
    const programmingState = useAppSelector(getProgrammingState);
    const resetProgress = useAppSelector(getResetProgress);
    const note = useAppSelector(getFirmwareNote);
    const programmingProgress = useAppSelector(getProgrammingProgress);
    const failedCore = programmingProgress.find(
        p => (p.progress?.totalProgressPercentage || 0) < 100
    )?.core;
    const notStarted = programmingProgress.every(p => !p.progress);
    const programming = programmingState === ProgrammingState.PROGRAMMING;
    const failed = programmingState === ProgrammingState.ERROR;
    const resetFailed =
        failed && resetProgress === ResetProgress.STARTED && !failedCore;

    const header = useMemo(() => {
        if (programming) {
            return 'Programming';
        }
        if (failed) {
            return 'Programming failed';
        }
        return 'Programming successful';
    }, [programming, failed]);

    const errorIcon = useMemo(() => {
        if (!deviceConnected || notStarted) {
            return 'mdi-lightbulb-alert-outline';
        }
        if (resetFailed) {
            return 'mdi-restore-alert';
        }
        return 'mdi-flash-alert-outline';
    }, [deviceConnected, resetFailed, notStarted]);

    const errorText = useMemo(() => {
        if (!deviceConnected || notStarted) {
            return 'No development kit detected';
        }
        if (resetFailed) {
            return 'Failed to reset the device';
        }
        return `Failed to program the ${failedCore} core`;
    }, [deviceConnected, resetFailed, failedCore, notStarted]);

    return (
        <Main>
            <Main.Content heading={header}>
                <ProgressIndicators />
                <div className="tw-pt-8">
                    {!failed && note && (
                        <InfoBox
                            mdiIcon="mdi-information-outline"
                            color="tw-text-primary"
                            title={note.title}
                            content={note.content}
                        />
                    )}
                    {failed && (
                        <IssueBox
                            mdiIcon={errorIcon}
                            color="tw-text-red"
                            title={errorText}
                        />
                    )}
                </div>
            </Main.Content>
            <Main.Footer>
                {programming && (
                    <div className="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-text-primary">
                        <Spinner size="lg" />
                    </div>
                )}
                <Back
                    onClick={() => {
                        dispatch(
                            setProgrammingState(
                                ProgrammingState.SELECT_FIRMWARE
                            )
                        );
                    }}
                    disabled={programming}
                />
                {failed ? (
                    <>
                        <Skip disabled={programming} />
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
                    </>
                ) : (
                    <Next disabled={programming} />
                )}
            </Main.Footer>
        </Main>
    );
};
