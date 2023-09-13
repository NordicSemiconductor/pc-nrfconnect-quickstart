/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../device/deviceSlice';
import { goToNextStep } from '../stepsSlice';
import { verifyDevice } from './sendAndReceiveATCommand';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const verification = useAppSelector(getChoiceUnsafely).verification;
    const deviceIsConnected = useAppSelector(selectedDeviceIsConnected);
    const [waitingForCheck, setWaitingForCheck] = useState(true);
    const [valid, setValid] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!verification) {
            dispatch(goToNextStep());
        }
    });

    useEffect(() => {
        const serialportPaths = device?.serialPorts
            ?.map(port => port.comName)
            .filter(path => path !== null) as string[];
        if (deviceIsConnected && verification) {
            verifyDevice(
                serialportPaths,
                verification.command,
                verification.response
            ).then(result => {
                setValid(result);
                setWaitingForCheck(false);
            });
        }
    }, [deviceIsConnected, device, verification]);

    return (
        <Main>
            <Main.Content
                heading={
                    deviceIsConnected ? 'Verify' : 'No development kit detected'
                }
                subHeading={
                    deviceIsConnected
                        ? ''
                        : 'Make sure you have a development kit connected.'
                }
            >
                {!deviceIsConnected && <p className="ellipsis">Searching</p>}
                {deviceIsConnected && waitingForCheck && (
                    <p className="ellipsis">Checking your device</p>
                )}
                {deviceIsConnected && !waitingForCheck && !valid && (
                    <p>
                        We were unable to communicate with your device.
                        <br />
                        <br />
                        Please contact <DevZoneLink />.
                    </p>
                )}
                {deviceIsConnected && !waitingForCheck && valid && (
                    <p>
                        We have succesfully communicated with your device.
                        <br />
                        <br />
                        Everything is in order!
                    </p>
                )}
            </Main.Content>
            <Main.Footer>
                <Back disabled={waitingForCheck} />
                <Next disabled={waitingForCheck} />
            </Main.Footer>
        </Main>
    );
};
