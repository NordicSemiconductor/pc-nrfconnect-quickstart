/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [startRead, setStartRead] = useState(false);
    const [failedRead, setFailedRead] = useState(false);
    const [failedReset, setFailedReset] = useState(false);
    const [iccid, setIccid] = useState('');

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
        new Promise<void>(resolve => {
            setTimeout(async () => {
                const res = await sp.sendCommand('AT%XICCID');
                setIccid(formatIccid(res));
                resolve();
            }, 1000);
        });

    const readICCID = async () => {
        let sp;
        try {
            sp = await getUARTSerialPort(device);
            await sp.sendCommand('AT+CFUN=41');
            await delayedIccidRead(sp);
        } catch (e) {
            sp?.unregister();
            setFailedRead(true);
            return;
        }

        try {
            sp.unregister();
            reset().catch(reset);
        } catch (e) {
            setFailedReset(true);
        }
    };

    return (
        <Main>
            <Main.Content heading="Activate SIM Card">
                <p>
                    Do you need to activate your SIM Card?
                    <br />
                    Follow these steps to complete the activation (iBasis only):
                </p>
                <br />
                <ul className="tw-list-inside tw-list-decimal">
                    <li>
                        Get the ICCID value by pressing <b>Read ICCID</b>
                        <br />
                        <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
                            <p
                                className={
                                    startRead && !failedRead && iccid === ''
                                        ? 'ellipsis'
                                        : ''
                                }
                            >
                                {!startRead && '...'}
                                <b>
                                    {startRead && !failedRead && iccid}
                                    {startRead && failedRead && 'ERROR'}
                                </b>
                            </p>
                            {iccid !== '' && <Copy copyText={iccid} />}
                        </div>
                    </li>
                    <br />
                    <li>
                        Use the ICCID to activate the SIM Card at{' '}
                        <b>
                            <u>LINK</u>
                        </b>
                    </li>
                </ul>
                {failedRead && (
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
                {failedReset && (
                    <>
                        Warning! Device may need to be restarted to operate
                        correctly.
                    </>
                )}
            </Main.Content>
            <Main.Footer>
                <Back />
                <Skip />
                {(!startRead || failedRead) && (
                    <Next
                        label={failedRead ? 'Retry' : 'Read ICCID'}
                        onClick={() => {
                            setIccid('');
                            setFailedRead(false);
                            setStartRead(true);
                            readICCID();
                        }}
                    />
                )}
                {startRead && !failedRead && <Next disabled={iccid === ''} />}
            </Main.Footer>
        </Main>
    );
};
