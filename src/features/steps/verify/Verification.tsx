/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { clipboard } from 'electron';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import { getVerifyStep } from '../../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import { autoFindUartSerialPort } from './sendAndReceiveATCommand';

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
    const [allowVerification, setAllowVerification] = useState(false);
    const [failed, setFailed] = useState(false);

    const [verification, setVerfication] = useState([
        ...getVerifyStep(device).commands.map(command => ({
            ...command,
            response: '',
        })),
    ]);

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
        const serialportPaths = device?.serialPorts
            ?.map(port => port.comName)
            .filter(path => path !== null) as string[];

        autoFindUartSerialPort(serialportPaths)
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

                setVerfication(newVerification);
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
                                        <span
                                            role="button"
                                            className="mdi mdi-content-copy tw-leading-none active:tw-text-primary"
                                            tabIndex={0}
                                            onClick={blurAndInvoke(() =>
                                                clipboard.writeText(response)
                                            )}
                                            onKeyUp={invokeIfSpaceOrEnterPressed(
                                                () =>
                                                    clipboard.writeText(
                                                        response
                                                    )
                                            )}
                                        />
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
                {!allowVerification && <Skip />}
                {allowVerification ? (
                    <Next disabled={!failed && !gotAllResponses} />
                ) : (
                    <Next
                        label="Verify"
                        onClick={() => {
                            setAllowVerification(true);
                            runVerification();
                        }}
                    />
                )}
            </Main.Footer>
        </Main>
    );
};
