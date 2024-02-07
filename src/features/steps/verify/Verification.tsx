/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import NoticeBox from '../../../common/NoticeBox';
import { getStepConfiguration } from '../../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';

const formatResponse = (response: string, responseRegex: RegExp) => {
    const filteredResponse = response
        .split('\n')
        .filter(line => !!line.trim() && line.trim() !== 'OK')
        .join('')
        .trim();

    const [, match] = filteredResponse.match(responseRegex) ?? [];

    return match;
};

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [connectFailed, setConnectFailed] = useState(false);
    const [readFailed, setReadFailed] = useState(false);
    const failed = connectFailed || readFailed;

    const initialVerification = [
        ...getStepConfiguration('verify', device).commands.map(command => ({
            ...command,
            response: '',
        })),
    ];

    const [verification, setVerification] = useState(initialVerification);

    const gotAllResponses = verification.every(
        ({ response }) => response !== ''
    );

    const runVerification = async () => {
        setVerification(initialVerification);
        setReadFailed(false);
        setVerificationStarted(true);
        let serialPort: Awaited<ReturnType<typeof getUARTSerialPort>>;
        try {
            serialPort = await getUARTSerialPort(device);
        } catch (error) {
            setConnectFailed(true);
            return;
        }

        const newVerification: typeof verification = [];
        const reducedPromise = getStepConfiguration(
            'verify',
            device
        ).commands.reduce(
            (acc, next) =>
                acc.then(() =>
                    serialPort.sendCommand(next.command).then(value => {
                        newVerification.push({
                            ...next,
                            response: formatResponse(
                                value,
                                new RegExp(next.responseRegex)
                            ),
                        });

                        return Promise.resolve();
                    })
                ),
            Promise.resolve()
        );
        try {
            await reducedPromise;

            setVerification(newVerification);
            serialPort.unregister();
        } catch (error) {
            setReadFailed(true);
        }
    };

    const getHeading = () => {
        if (!verificationStarted) {
            return 'Verify';
        }
        if (readFailed || connectFailed) {
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
                    !verificationStarted
                        ? 'Automatically verify kit communication with AT commands.'
                        : ''
                }
            >
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {verification.map(
                        ({ title, response, copiable = false }) => (
                            <div key={title}>
                                <p>
                                    <i className="tw-font-light">{title}</i>
                                </p>
                                <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
                                    <p
                                        className={
                                            verificationStarted &&
                                            !failed &&
                                            response === ''
                                                ? 'ellipsis'
                                                : ''
                                        }
                                    >
                                        {!verificationStarted && '...'}
                                        {verificationStarted && (
                                            <b>
                                                {!failed ? response : 'ERROR'}
                                            </b>
                                        )}
                                    </p>
                                    {copiable &&
                                        verificationStarted &&
                                        !failed &&
                                        response !== '' && (
                                            <Copy copyText={response} />
                                        )}
                                </div>
                            </div>
                        )
                    )}
                </div>
                {failed && (
                    <div className="tw-pt-8">
                        <NoticeBox
                            mdiIcon="mdi-lightbulb-alert-outline"
                            color="tw-text-red"
                            title={
                                readFailed
                                    ? 'Failed to read '
                                    : 'Verification failed'
                            }
                        />
                    </div>
                )}
            </Main.Content>
            <Main.Footer>
                <Back />
                <Skip />
                {verificationStarted && !failed && (
                    <Next disabled={!gotAllResponses} />
                )}
                {(!verificationStarted || failed) && (
                    <Next
                        label={failed ? 'Retry' : 'Verify'}
                        onClick={() => {
                            runVerification();
                        }}
                    />
                )}
            </Main.Footer>
        </Main>
    );
};
