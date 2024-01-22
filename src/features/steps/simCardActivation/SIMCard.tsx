/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    classNames,
    describeError,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import Link from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';
import { clearIssue, setIssue } from '../../issue/issueSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [startRead, setStartRead] = useState(false);
    const [failedRead, setFailedRead] = useState(false);
    const [iccid, setIccid] = useState('');
    const dispatch = useAppDispatch();

    const formatIccid = (response: string) => {
        const filteredResponse = response
            .split('\n')
            .filter(line => !!line && line.trim() !== 'OK')
            .join('')
            .trim();

        const [, match] = filteredResponse.match(/%XICCID: (.{18}).*/) ?? [];

        return match;
    };

    const reset = () =>
        NrfutilDeviceLib.reset(device, 'Application', 'RESET_SYSTEM');

    const delayedIccidRead = (
        sp: Awaited<ReturnType<typeof getUARTSerialPort>>
    ) =>
        new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const res = await sp.sendCommand('AT%XICCID');
                    setIccid(formatIccid(res));
                    resolve();
                } catch (e) {
                    reject(new Error('Failed to read ICCID'));
                }
            }, 1000);
        });

    const readICCID = async () => {
        // Reset state
        setIccid('');
        setFailedRead(false);
        setStartRead(true);

        let sp;
        try {
            sp = await getUARTSerialPort(device);
            await sp.sendCommand('AT+CFUN=41');
        } catch (e) {
            sp?.unregister();
            setFailedRead(true);
            dispatch(
                setIssue({
                    level: 'error',
                    issueContent: describeError(e),
                    solutionContent: (
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(clearIssue());
                                readICCID();
                            }}
                            className="tw-flex tw-flex-row tw-items-center tw-text-primary"
                        >
                            <span className="mdi mdi-arrow-right-drop-circle-outline tw-mr-1 tw-inline tw-text-base tw-leading-none tw-text-primary" />
                            Retry reading the ICCID.
                        </button>
                    ),
                })
            );
            return;
        }

        try {
            await delayedIccidRead(sp);
        } catch (e) {
            sp?.unregister();
            setFailedRead(true);
            dispatch(
                setIssue({
                    level: 'error',
                    issueContent: describeError(e),
                    solutionContent: (
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(clearIssue());
                                readICCID();
                            }}
                            className="tw-flex tw-flex-row tw-items-center tw-text-primary"
                        >
                            <span className="mdi mdi-arrow-right-drop-circle-outline tw-mr-1 tw-inline tw-text-base tw-leading-none tw-text-primary" />
                            Retry reading the ICCID.
                        </button>
                    ),
                })
            );
            return;
        }

        try {
            sp.unregister();
            reset();
        } catch (e) {
            dispatch(
                setIssue({
                    level: 'warning',
                    issueContent:
                        'Device may need to be restarted to operate correctly.',
                    solutionContent: (
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(clearIssue());
                                reset().then(() => dispatch(clearIssue()));
                            }}
                            className="tw-flex tw-flex-row tw-items-center tw-text-primary"
                        >
                            <span className="mdi mdi-refresh tw-mr-1 tw-inline tw-text-base tw-leading-none tw-text-primary" />
                            Restart the device
                        </button>
                    ),
                })
            );
        }
    };

    return (
        <Main>
            <Main.Content heading="Set up iBasis SIM card">
                <p>
                    If you are using the included iBasis SIM card, you need to
                    register and enable it through nRF Cloud.
                </p>
                <p>Complete the following steps:</p>
                <br />
                <ol className="tw-list-outside tw-list-decimal tw-pl-4">
                    <li>
                        <Link
                            label="Log in or create nRF Cloud account"
                            href="https://nrfcloud.com/#/"
                            color="tw-text-primary"
                        />
                        .
                    </li>
                    <li>
                        In nRF Cloud, click <b>Device Management</b> &gt;{' '}
                        <b>SIM Cards</b> &gt; <b>Add SIM</b>.
                    </li>
                    <li>
                        Enter the <b>Personal Unblocking Key (PUK)</b> from the
                        back of the SIM card.
                    </li>
                    <li>
                        <div className="tw-inline">
                            Enter the <b>ICCID: </b>
                            {!startRead && (
                                <p className="tw-inline tw-pr-4">...</p>
                            )}
                            {startRead && (
                                <p
                                    className={classNames(
                                        'tw-inline',
                                        'tw-pr-4',
                                        !failedRead && iccid === ''
                                            ? 'ellipsis'
                                            : ''
                                    )}
                                >
                                    {failedRead ? 'ERROR' : iccid}
                                </p>
                            )}
                            {(!startRead || failedRead) && (
                                <button
                                    type="button"
                                    className="tw-inline"
                                    onClick={readICCID}
                                >
                                    <span className="mdi mdi-refresh tw-leading-none active:tw-text-primary" />
                                </button>
                            )}
                            {iccid !== '' && !failedRead && startRead && (
                                <>
                                    <Copy copyText={iccid} />
                                    <br />
                                    These are the first 18 digits of the ICCID
                                    that are required for SIM activation.
                                </>
                            )}
                        </div>
                    </li>
                    <li>
                        Accept the terms and the privacy policy and click{' '}
                        <b>Activate SIM</b>.
                    </li>
                </ol>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
