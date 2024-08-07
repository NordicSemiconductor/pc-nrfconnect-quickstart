/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import describeError from '@nordicsemiconductor/pc-nrfconnect-shared/src/logging/describeError';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
} from '../../../features/device/deviceSlice';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next, Skip } from '../../Next';
import { IssueBox } from '../../NoticeBox';
import runVerification from './serialport';
import { getError, getResponse, reset, setError } from './verifySlice';

import './cursor.scss';

export default ({ vComIndex, regex }: { vComIndex: number; regex: RegExp }) => {
    const choice = useAppSelector(getChoiceUnsafely);
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const response = useAppSelector(getResponse);
    const error = useAppSelector(getError);
    const [cleanup, setCleanup] = useState<() => void>();
    const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout>();
    const [validResponse, setValidResponse] = useState<string>();
    const waiting = !error && !validResponse;

    useEffect(() => {
        if (!error && !response) {
            // May receive the end of device output after programming reset if user pressed next too quikcly
            setTimeout(() => {
                dispatch(runVerification(device, vComIndex))
                    .then(cl => {
                        setCleanup(() => cl);
                        setErrorTimeout(
                            setTimeout(() => {
                                cl();
                                setErrorTimeout(undefined);
                                dispatch(
                                    setError(
                                        'Timed out or did not receive expected value'
                                    )
                                );
                            }, 3000)
                        );
                    })
                    .catch(e => {
                        console.log(e);
                        dispatch(setError(describeError(e)));
                    });
            }, 3000);
        }
    }, [dispatch, response, error, device, vComIndex, regex]);

    useEffect(() => {
        if (!validResponse) {
            const [, match] = (response || '').match(regex) ?? [];
            if (match) {
                clearTimeout(errorTimeout);
                cleanup?.();
                setValidResponse(match);
            }
        }
    }, [response, validResponse, regex, errorTimeout, cleanup]);

    const getHeading = () => {
        if (error) {
            return 'Verification failed';
        }
        if (!waiting) {
            return 'Verification successful';
        }
        return 'Verifying';
    };

    return (
        <Main>
            <Main.Content heading={getHeading()}>
                <p>Serial output from the {choice.name} application</p>
                <div className="alt-font tw-mt-4 tw-bg-gray-600 tw-p-4 tw-text-gray-50">
                    {!validResponse && <div className="cursor" />}
                    {validResponse
                        ?.split('\n')
                        .filter(Boolean)
                        .map(line => (
                            <p key={line}>{line}</p>
                        ))}
                </div>
                {error && (
                    <div className="tw-pt-4">
                        <IssueBox
                            mdiIcon="tw-mdi-alert"
                            color="tw-text-red"
                            title={error}
                        />
                    </div>
                )}
            </Main.Content>
            <Main.Footer>
                <Back disabled={waiting} />
                {error && <Skip />}
                {error ? (
                    <Next label="Retry" onClick={() => dispatch(reset())} />
                ) : (
                    <Next disabled={waiting || !!error} />
                )}
            </Main.Footer>
        </Main>
    );
};
