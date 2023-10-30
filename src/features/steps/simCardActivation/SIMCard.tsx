/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import Link, { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';

const invokeIfSpaceOrEnterPressed =
    (onClick: React.KeyboardEventHandler<Element>) =>
    (event: React.KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === ' ' || event.key === 'Enter') {
            onClick(event);
        }
    };

const blurAndInvoke =
    (
        onClick: React.MouseEventHandler<HTMLElement>
    ): React.MouseEventHandler<HTMLElement> =>
    (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.currentTarget.blur();
        onClick(event);
    };

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
            <Main.Content heading="Set up iBasis micro-SIM card">
                <p>
                    If you have an iBasis micro-SIM card, you can connect to nRF
                    Cloud.
                </p>
                <p>Prepare the following information:</p>
                <br />
                <ul className="tw-list-outside tw-list-disc tw-pl-4">
                    <li>
                        The <b>Personal Unblocking Key (PUK)</b> from the
                        micro-SIM card.
                    </li>
                    <li>
                        <p className="tw-inline">
                            <b>ICCID: </b>
                            {!startRead && (
                                <div className="tw-inline tw-pr-4">...</div>
                            )}
                            {startRead && (
                                <div
                                    className={classNames(
                                        'tw-inline',
                                        'tw-pr-4',
                                        !failedRead && iccid === ''
                                            ? 'ellipsis'
                                            : ''
                                    )}
                                >
                                    {failedRead ? 'ERROR' : iccid}
                                </div>
                            )}
                            {(!startRead || failedRead) && (
                                <span
                                    role="button"
                                    className="mdi mdi-refresh tw-inline tw-leading-none active:tw-text-primary"
                                    tabIndex={0}
                                    onClick={blurAndInvoke(() => {
                                        setIccid('');
                                        setFailedRead(false);
                                        setStartRead(true);
                                        readICCID();
                                    })}
                                    onKeyUp={invokeIfSpaceOrEnterPressed(() => {
                                        setIccid('');
                                        setFailedRead(false);
                                        setStartRead(true);
                                        readICCID();
                                    })}
                                />
                            )}
                            {iccid !== '' && !failedRead && startRead && (
                                <>
                                    <Copy copyText={iccid} />
                                    <br />
                                    These are the first 18 digits of the ICCID
                                    that are required for SIM activation.
                                </>
                            )}
                        </p>
                    </li>
                    <li>
                        <Link
                            label="nRF Cloud account"
                            href="https://nrfcloud.com/#/"
                            color="tw-text-primary"
                        />
                        .
                    </li>
                </ul>
                <br />
                <p>
                    With this information ready, follow the steps for{' '}
                    <Link
                        label="connecting the nRF9160 DK to nRF Cloud"
                        href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/device_guides/working_with_nrf/nrf91/nrf9160_gs.html#nrf9160-gs-connect-to-cloud"
                        color="tw-text-primary"
                    />{' '}
                    in the nRF Connect SDK documentation.
                </p>
                {failedRead && (
                    <>
                        <br />
                        <p>
                            Could not communicate with kit. Retry reading the
                            ICCID.
                        </p>
                        <p>
                            Contact support on <DevZoneLink /> if the problem
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
