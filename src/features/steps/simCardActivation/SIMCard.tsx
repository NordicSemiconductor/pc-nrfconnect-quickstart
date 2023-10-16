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
import Link, { DevZoneLink } from '../../../common/Link';
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
            <Main.Content heading="Set up iBasis micro-SIM Card">
                <p>
                    If you are planning to{' '}
                    <Link
                        label="connect to nRF Cloud"
                        href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/device_guides/working_with_nrf/nrf91/nrf9160_gs.html#nrf9160-gs-connect-to-cloud"
                        color="tw-text-primary"
                    />{' '}
                    with an iBasis micro-SIM card, complete the following steps:
                </p>
                <br />
                <ul className="tw-list-inside tw-list-decimal">
                    <li>
                        Write down the <b>Personal Unblocking Key (PUK)</b> from
                        the micro-SIM card.
                    </li>
                    <li>
                        Insert the micro-SIM into the SIM card holder and turn
                        the device off and on again.
                    </li>
                    <li>
                        Click the Read ICCID button below. The full ICCID has 20
                        digits, but you only need the first 18 digits.
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
                    <li>
                        <Link
                            label="Log in or register to nRF Cloud"
                            href="https://nrfcloud.com/#/"
                            color="tw-text-primary"
                        />
                    </li>
                    <li>
                        On the main nRF Cloud dashboard, click the + button to
                        add a new <b>LTE Device</b>.
                    </li>
                    <li>
                        In the <b>Verify SIM Info</b> section, enter the
                        18-digit ICCID and the PUK.
                    </li>
                    <li>
                        Click <b>Activate SIM</b>. The device searches for the
                        cellular network and connects to the nRF Cloud server,
                        which can take a while.
                    </li>
                    <li>
                        In <b>Add LTE Device</b>, provide the required
                        information and click <b>Add Device</b>.
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
