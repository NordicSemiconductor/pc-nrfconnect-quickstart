/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    describeError,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    AppThunk,
    RootState,
    useAppDispatch,
    useAppSelector,
} from '../../../app/store';
import { DeviceWithSerialnumber } from '../../../features/device/deviceLib';
import { getSelectedDeviceUnsafely } from '../../../features/device/deviceSlice';
import getUARTSerialPort from '../../../features/device/getUARTSerialPort';
import { Back } from '../../Back';
import Copy from '../../Copy';
import { formatResponse } from '../../formatATResponse';
import Main from '../../Main';
import { Next, Skip } from '../../Next';
import { IssueBox } from '../../NoticeBox';
import {
    getFailed,
    getResponses,
    getShowSkip,
    setFailed,
    setResponses,
} from './verificationSlice';

export interface Command {
    title: string;
    command: string;
    responseRegex: string;
    copiable?: boolean;
}

const runVerification =
    (
        commands: Command[],
        device: DeviceWithSerialnumber
    ): AppThunk<RootState, Promise<void>> =>
    async dispatch => {
        dispatch(setFailed(false));
        let serialPort: Awaited<ReturnType<typeof getUARTSerialPort>>;
        try {
            serialPort = await getUARTSerialPort(device);
        } catch (error) {
            logger.error(describeError(error));
            dispatch(setFailed(true));
            return;
        }

        const newResponses: string[] = [];
        const reducedPromise = commands.reduce(
            (acc, next) =>
                acc.then(() =>
                    serialPort.sendCommand(next.command).then(value => {
                        newResponses.push(
                            formatResponse(value, next.responseRegex)
                        );

                        return Promise.resolve();
                    })
                ),
            Promise.resolve()
        );
        try {
            await reducedPromise;

            dispatch(setResponses(newResponses));
            serialPort.unregister();
        } catch (e) {
            logger.error('Received ERROR as return value from AT command');
            dispatch(setFailed(true));
        }
    };

const VerifyStep = ({ commands }: { commands: Command[] }) => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const responses = useAppSelector(getResponses);
    const failed = useAppSelector(getFailed);
    const showSkip = useAppSelector(getShowSkip);
    const [verifying, setVerifying] = useState(false);

    const gotAllResponses = responses.length === commands.length;

    const getHeading = () => {
        if (failed) {
            return 'Verification failed';
        }
        if (gotAllResponses) {
            return 'Verification successful';
        }
        return 'Verifying';
    };

    useEffect(() => {
        if (!failed && !gotAllResponses && !verifying) {
            setVerifying(true);
            dispatch(runVerification(commands, device)).then(() =>
                setVerifying(false)
            );
        }
    }, [failed, gotAllResponses, verifying, dispatch, commands, device]);

    return (
        <Main>
            <Main.Content
                heading={getHeading()}
                subHeading={
                    !verifying
                        ? 'Automatically verify kit communication with AT commands.'
                        : ''
                }
            >
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {commands.map(({ title, copiable = false }, index) => (
                        <div key={title}>
                            <p>
                                <i className="tw-font-light">{title}</i>
                            </p>
                            <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
                                <p className={verifying ? 'ellipsis' : ''}>
                                    {!verifying && (
                                        <b>
                                            {!failed &&
                                                gotAllResponses &&
                                                responses[index]}
                                            {failed && 'ERROR'}
                                        </b>
                                    )}
                                </p>
                                {copiable &&
                                    responses[index] &&
                                    !failed &&
                                    !verifying && (
                                        <Copy copyText={responses[index]} />
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
                {failed && (
                    <div className="tw-pt-8">
                        <IssueBox
                            mdiIcon="mdi-lightbulb-alert-outline"
                            color="tw-text-red"
                            title="Failed to verify device"
                        />
                    </div>
                )}
            </Main.Content>
            <Main.Footer>
                <Back />
                {showSkip && <Skip />}
                {failed ? (
                    <Next
                        label="Retry"
                        disabled={verifying}
                        onClick={async () => {
                            setVerifying(true);
                            await dispatch(runVerification(commands, device));
                            setVerifying(false);
                        }}
                    />
                ) : (
                    <Next disabled={verifying} />
                )}
            </Main.Footer>
        </Main>
    );
};
export default (commands: Command[]) => ({
    name: 'Verify',
    component: () => VerifyStep({ commands }),
});
