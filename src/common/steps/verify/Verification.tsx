/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    describeError,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    AppThunk,
    RootState,
    useAppDispatch,
    useAppSelector,
} from '../../../app/store';
import { DeviceWithSerialnumber } from '../../../features/device/deviceLib';
import { getSelectedDeviceUnsafely } from '../../../features/device/deviceSlice';
import getUARTSerialPort from '../../../features/device/getUARTSerialPort';
import { Back } from '../../Back';
import Copy from '../../Copy';
import Main from '../../Main';
import { Next, Skip } from '../../Next';
import { IssueBox } from '../../NoticeBox';
import {
    getFailed,
    getResponses,
    getShowSkip,
    setFailed,
    setResponses,
} from './verificationSlice';

export interface Command {
    title: string;
    command: string;
    responseRegex: string;
    copiable?: boolean;
}

const formatResponse = (response: string, responseRegex: RegExp) => {
    const filteredResponse = response
        .split('\n')
        .filter(line => !!line.trim() && line.trim() !== 'OK')
        .join('')
        .trim();

    const [, match] = filteredResponse.match(responseRegex) ?? [];

    return match;
};

const runVerification =
    (
        commands: Command[],
        device: DeviceWithSerialnumber
    ): AppThunk<RootState, Promise<void>> =>
    async dispatch => {
        dispatch(setFailed(false));
        let serialPort: Awaited<ReturnType<typeof getUARTSerialPort>>;
        try {
            serialPort = await getUARTSerialPort(device);
        } catch (error) {
            logger.error(describeError(error));
            dispatch(setFailed(true));
            return;
        }

        const newResponses: string[] = [];
        const reducedPromise = commands.reduce(
            (acc, next) =>
                acc.then(() =>
                    serialPort.sendCommand(next.command).then(value => {
                        newResponses.push(
                            formatResponse(
                                value,
                                new RegExp(next.responseRegex)
                            )
                        );

                        return Promise.resolve();
                    })
                ),
            Promise.resolve()
        );
        try {
            await reducedPromise;

            dispatch(setResponses(newResponses));
            serialPort.unregister();
        } catch (e) {
            logger.error('Received ERROR as return value from AT command');
            dispatch(setFailed(true));
        }
    };

export default ({ commands }: { commands: Command[] }) => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const responses = useAppSelector(getResponses);
    const failed = useAppSelector(getFailed);
    const showSkip = useAppSelector(getShowSkip);
    const [verifying, setVerifying] = useState(false);

    const gotAllResponses = responses.every(response => response !== '');

    const getHeading = () => {
        if (!verifying) {
            return 'Verify';
        }
        if (failed) {
            return 'Verification failed';
        }
        if (gotAllResponses) {
            return 'Verification successful';
        }
        return 'Verifying';
    };

    return (
        <Main>
            <Main.Content
                heading={getHeading()}
                subHeading={
                    !verifying
                        ? 'Automatically verify kit communication with AT commands.'
                        : ''
                }
            >
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {commands.map(({ title, copiable = false }, index) => (
                        <div key={title}>
                            <p>
                                <i className="tw-font-light">{title}</i>
                            </p>
                            <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
                                <p className={verifying ? 'ellipsis' : ''}>
                                    {verifying ? (
                                        <b>
                                            {failed
                                                ? 'ERROR'
                                                : responses[index]}
                                        </b>
                                    ) : (
                                        '...'
                                    )}
                                </p>
                                {copiable && responses[index] && !failed && (
                                    <Copy copyText={responses[index]} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {failed && (
                    <div className="tw-pt-8">
                        <IssueBox
                            mdiIcon="mdi-lightbulb-alert-outline"
                            color="tw-text-red"
                            title="Failed to verify device"
                        />
                    </div>
                )}
            </Main.Content>
            <Main.Footer>
                <Back />
                {showSkip && <Skip />}
                {verifying && !failed && <Next disabled={!gotAllResponses} />}
                {(!verifying || failed) && (
                    <Next
                        label={failed ? 'Retry' : 'Verify'}
                        onClick={async () => {
                            setVerifying(true);
                            await dispatch(runVerification(commands, device));
                            setVerifying(false);
                        }}
                    />
                )}
            </Main.Footer>
        </Main>
    );
};
