/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useMemo } from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { getChoiceUnsafely } from '../../../features/device/deviceSlice';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next, Skip } from '../../Next';
import { InfoBox, IssueBox } from '../../NoticeBox';
import { resetDevice, startProgramming } from './programEffects';
import { getError, getProgrammingProgress, reset } from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();
    const note = useAppSelector(getChoiceUnsafely).firmwareNote;
    const error = useAppSelector(getError);
    const programmingProgress = useAppSelector(getProgrammingProgress);
    const succeeded = programmingProgress?.every(p => p.progress === 100);
    const programming = !error && !succeeded;
    // Check if anything except last component (reset) failed
    const resetFailed = !(
        (programmingProgress?.findIndex(p => (p.progress || 0) < 100) || 0) <
        (programmingProgress?.length || 0) - 1
    );

    const header = useMemo(() => {
        if (error) return 'Programming failed';
        if (succeeded) return 'Programming successful';
        return 'Programming';
    }, [error, succeeded]);

    return (
        <Main>
            <Main.Content heading={header}>
                <ProgressIndicators />
                <div className="tw-pt-8">
                    {!error && note && (
                        <InfoBox
                            mdiIcon="mdi-information-outline"
                            color="tw-text-primary"
                            title={note.title}
                            content={note.content}
                        />
                    )}
                    {!!error && (
                        <IssueBox
                            mdiIcon={error.icon}
                            color="tw-text-red"
                            title={error.text}
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
                        dispatch(reset());
                    }}
                    disabled={programming}
                />
                {error ? (
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
