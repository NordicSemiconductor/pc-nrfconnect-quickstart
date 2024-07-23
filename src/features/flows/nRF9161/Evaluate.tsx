/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    Button,
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
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { IssueBox } from '../../../common/NoticeBox';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import getUARTSerialPort from '../../device/getUARTSerialPort';
import {
    getAttestationToken,
    getFailed,
    setAttestationToken,
    setFailed,
} from './nrf9161Slice';

const nRFCloudLink =
    'https://docs.nordicsemi.com/bundle/nrf-cloud/page/GettingStarted.html';

export default () => {
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
