/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    Button,
    classNames,
    logger,
    openUrl,
    Spinner,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import describeError from '@nordicsemiconductor/pc-nrfconnect-shared/src/logging/describeError';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Copy from '../../../common/Copy';
import { formatResponse } from '../../../common/formatATResponse';
import Link from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { IssueBox } from '../../../common/NoticeBox';
import { ResourceWithButton } from '../../../common/Resource';
import Evaluate from '../../../common/steps/Evaluate';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
} from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';
import {
    getAttestationToken,
    getFailed,
    setAttestationToken,
    setFailed,
} from './nrf9151Slice';

const nRFCloudLink =
    'https://docs.nordicsemi.com/bundle/nrf-cloud/page/GettingStarted.html';

const MSSEvaluateStep = () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const token = useAppSelector(getAttestationToken);
    const failed = useAppSelector(getFailed);
    const [gettingToken, setGettingToken] = useState(false);

    return (
        <Main>
            <Main.Content
                heading="Evaluate nRF Cloud multi-service sample"
                subHeading="Onboarding, data collection, FOTA updates, location, logging, alerts, and more."
            >
                <div className="tw-flex tw-flex-col tw-gap-4">
                    <div>
                        <b>Claim your device</b>
                        <p>
                            To evaluate all features you need to connect your DK
                            to nRF Cloud. Copy the attestation token below and
                            follow the instructions.
                        </p>
                    </div>
                    <div className="tw-flex tw-flex-row tw-gap-1">
                        <p className={gettingToken ? 'ellipsis' : ''}>
                            {!gettingToken && !token && !failed && '...'}
                            {token && (
                                <div className="tw-flex tw-flex-row tw-items-center tw-gap-1">
                                    <b
                                        title={token}
                                        className="tw-block tw-w-60 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap"
                                    >
                                        {token}
                                    </b>
                                    <Copy copyText={token} />
                                </div>
                            )}
                            <b>{failed && 'ERROR'}</b>
                        </p>
                    </div>

                    <Button
                        variant="link-button"
                        size="xl"
                        onClick={() => {
                            telemetry.sendEvent('Opened evaluation link', {
                                link: nRFCloudLink,
                            });
                            openUrl(nRFCloudLink);
                        }}
                        className="tw-w-fit"
                    >
                        Open instructions
                    </Button>

                    {failed && (
                        <IssueBox
                            mdiIcon="mdi-lightbulb-alert-outline"
                            color="tw-text-red"
                            title="Failed to get the attestation token."
                        />
                    )}
                </div>
            </Main.Content>
            <Main.Footer>
                {gettingToken && (
                    <div className="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-text-primary">
                        <Spinner size="lg" />
                    </div>
                )}
                <Back disabled={gettingToken} />
                {!token && <Next label="Skip" variant="link-button" />}
                {token ? (
                    <Next disabled={failed} />
                ) : (
                    <Next
                        label={failed ? 'Retry' : 'Get token'}
                        disabled={gettingToken}
                        onClick={async () => {
                            setGettingToken(true);
                            dispatch(setFailed(false));

                            let serialPort:
                                | Awaited<ReturnType<typeof getUARTSerialPort>>
                                | undefined;
                            try {
                                serialPort = await getUARTSerialPort(device);
                                const attestationToken = await serialPort
                                    .sendCommand('AT%ATTESTTOKEN')
                                    .then(response =>
                                        formatResponse(
                                            response,
                                            '%ATTESTTOKEN: "(.*)"'
                                        )
                                    );

                                dispatch(setAttestationToken(attestationToken));
                            } catch (error) {
                                logger.error(describeError(error));
                                dispatch(setFailed(true));
                            }

                            setGettingToken(false);
                            serialPort?.unregister();
                        }}
                    />
                )}
            </Main.Footer>
        </Main>
    );
};

const baseEvaluationConfig = [
    {
        ref: 'AT Commands',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description:
                    'Use the Serial Terminal PC application as a serial interface to send AT commands to the device',
                links: [
                    {
                        label: 'AT Commands reference manual',
                        href: 'https://docs.nordicsemi.com/bundle/ref_at_commands_nrf91x1/page/REF/at_commands/intro_nrf91x1.html',
                    },
                    {
                        label: 'IP AT Commands Documentation',
                        href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/doc/AT_commands.html',
                    },
                ],
            },
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
            },
        ],
    },
    {
        ref: 'Asset Tracking',
        resources: [
            {
                title: 'Cellular IoT Fundamentals',
                mainLink: {
                    label: 'Open course',
                    href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/lessons/lesson-1-cellular-fundamentals/topic/lesson-1-exercise-1/',
                },
                description:
                    'Follow Exercise 1 in the Cellular IoT Fundamentals course to evaluate cloud connectivity.',
            },
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
            },
        ],
    },
    {
        ref: 'Shell Command Line Interface',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description: 'Serial interface to send commands to the device.',
                supplemetaryLinks: [
                    {
                        label: 'Modem shell commands',
                        href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html#overview',
                    },
                    {
                        label: 'AT Commands reference manual',
                        href: 'https://docs.nordicsemi.com/bundle/ref_at_commands_nrf91x1/page/REF/at_commands/intro_nrf91x1.html',
                    },
                ],
            },
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
            },
        ],
    },
];

const SelectEvaluate = () => {
    const choice = useAppSelector(getChoiceUnsafely);
    console.log(choice);
    return choice.name === 'nRF Cloud multi-service'
        ? MSSEvaluateStep()
        : Evaluate(baseEvaluationConfig).component();
};

export default () => ({
    name: 'Evaluate',
    component: SelectEvaluate,
});
