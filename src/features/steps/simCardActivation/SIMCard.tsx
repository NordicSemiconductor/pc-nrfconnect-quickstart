/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { Button, classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';
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
                    If you want to{' '}
                    <Link
                        label="connect to nRF Cloud"
                        href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/device_guides/working_with_nrf/nrf91/nrf9160_gs.html#nrf9160-gs-connect-to-cloud"
                        color="tw-text-primary"
                    />{' '}
                    with an iBasis micro-SIM card, complete these steps:
                </p>
                <br />
                <ol className="tw-list-inside tw-list-decimal">
                    <li>
                        Write down the <b>Personal Unblocking Key (PUK)</b> from
                        the micro-SIM card.
                    </li>
                    <li>
                        Insert the micro-SIM into the SIM card holder and turn
                        the device off and on again.
                    </li>
                    <li>
                        {!startRead || failedRead ? (
                            <Button
                                size="sm"
                                variant="primary"
                                className="tw-inline"
                                onClick={() => {
                                    setIccid('');
                                    setFailedRead(false);
                                    setStartRead(true);
                                    readICCID();
                                }}
                            >
                                Read ICCID
                            </Button>
                        ) : (
                            <>
                                ICCID:{' '}
                                <p
                                    className={classNames(
                                        'tw-inline',
                                        'tw-pr-4',
                                        !failedRead && iccid === ''
                                            ? 'ellipsis'
                                            : ''
                                    )}
                                >
                                    <b>{failedRead ? 'ERROR' : iccid}</b>
                                </p>
                                {iccid !== '' && <Copy copyText={iccid} />}
                            </>
                        )}
                        <br />
                        The ICCID has 20 digits, but you only need the first 18
                        digits.
                    </li>
                    <li>
                        <Link
                            label="Log in or register to nRF Cloud"
                            href="https://nrfcloud.com/#/"
                            color="tw-text-primary"
                        />
                        .
                    </li>
                    <li>
                        On the nRF Cloud dashboard, click <b>+</b> to add a new{' '}
                        <b>LTE Device</b>.
                    </li>
                    <li>
                        In <b>Verify SIM Info</b>, enter the 18-digit ICCID and
                        the PUK.
                    </li>
                    <li>
                        Click <b>Activate SIM</b>. After a while, the device
                        connects to the nRF Cloud server.
                    </li>
                    <li>
                        In <b>Add LTE Device</b>, provide the required
                        information and click <b>Add Device</b>.
                    </li>
                </ol>
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
                <Next />
            </Main.Footer>
        </Main>
    );
};
