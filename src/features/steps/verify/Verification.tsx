/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import { getVerifyStep } from '../../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [allowVerification, setAllowVerification] = useState(false);
    const [failed, setFailed] = useState(false);

    const initialVerification = [
        ...getVerifyStep(device).commands.map(command => ({
            ...command,
            response: '',
        })),
    ];

    const [verification, setVerification] = useState(initialVerification);

    const gotAllResponses = verification.every(
        ({ response }) => response !== ''
    );

    const formatResponse = (response: string, responseRegex: RegExp) => {
        const filteredResponse = response
            .split('\n')
            .filter(line => !!line && line.trim() !== 'OK')
            .join('')
            .trim();

        const [, match] = filteredResponse.match(responseRegex) ?? [];

        return match;
    };

    const runVerification = () => {
        getUARTSerialPort(device)
            .then(async result => {
                const newVerification: typeof verification = [];
                const reducedPromise = getVerifyStep(device).commands.reduce(
                    (acc, next) =>
                        acc.then(() =>
                            result.sendCommand(next.command).then(value => {
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

                await reducedPromise;

                setVerification(newVerification);
                result.unregister();
            })
            .catch(() => setFailed(true));
    };

    const getHeading = () => {
        if (!allowVerification) {
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
                    !allowVerification
                        ? 'Automatically verify kit communication with AT commands'
                        : ''
                }
            >
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {verification.map(({ title, response, copiable }) => (
                        <div key={title}>
                            <p>
                                <i className="tw-font-light">{title}</i>
                            </p>
                            <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
                                <p
                                    className={
                                        allowVerification &&
                                        !failed &&
                                        response === ''
                                            ? 'ellipsis'
                                            : ''
                                    }
                                >
                                    {!allowVerification && '...'}
                                    <b>
                                        {allowVerification &&
                                            !failed &&
                                            response}
                                        {allowVerification && failed && 'ERROR'}
                                    </b>
                                </p>
                                {copiable &&
                                    allowVerification &&
                                    !failed &&
                                    response !== '' && (
                                        <Copy copyText={response} />
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
                {failed && (
                    <>
                        <br />
                        <br />
                        <p>Could not communicate with kit</p>
                        <br />
                        <p>
                            Contact support on <DevZoneLink /> if problem
                            persist.
                        </p>
                    </>
                )}
            </Main.Content>
            <Main.Footer>
                <Back />
                <Skip />
                {allowVerification && !failed && (
                    <Next disabled={!gotAllResponses} />
                )}
                {(!allowVerification || failed) && (
                    <Next
                        label={failed ? 'Retry' : 'Verify'}
                        onClick={() => {
                            setVerification(initialVerification);
                            setFailed(false);
                            setAllowVerification(true);
                            runVerification();
                        }}
                    />
                )}
            </Main.Footer>
        </Main>
    );
};
