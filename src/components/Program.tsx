/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { enumerate } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button, Device, getDeviceLibContext } from 'pc-nrfconnect-shared';

import { program } from '../features/deviceLib';
import { deviceEvaluationChoices } from '../features/devices';
import Heading from './Heading';
import Main from './Main';

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className="tw-h-full tw-bg-primary"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const ProgramContent = ({ firmware }: { firmware: object[] }) => (
    <>
        <Heading>Programming...</Heading>
        <p className="tw-pt-4">This might take a few minutes. Please wait.</p>
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-9 tw-pt-10">
            {/* @ts-expect-error no type definitions for this yet */}
            {firmware.map(({ type: format, name, progress: progressInfo }) => (
                <div key={name} className="tw-flex tw-flex-col tw-gap-1">
                    <div className="tw-flex tw-flex-row tw-justify-between">
                        <p>{format}</p>
                        <p className="tw-text-primary">{name}</p>
                    </div>
                    <ProgressBar percentage={progressInfo.progressPercentage} />
                </div>
            ))}
        </div>
    </>
);

const SuccessContent = () => (
    <>
        <Heading>Success!</Heading>
        <div className="tw-max-w-sm tw-pt-10">
            <p>
                Device was programmed and we successfully communicated with the
                kit.
            </p>
            <p className="tw-pt-4">
                Contact support on{' '}
                <u>
                    <strong>DevZone</strong>
                </u>{' '}
                if verification fails.
            </p>
        </div>
    </>
);

const testDevice = 'NRF9161 DK';
const testChoiceIndex = 1;

export type JlinkOperationName =
    | 'program'
    | 'core-info'
    | 'protection-get'
    | 'protection-set'
    | 'register-read'
    | 'fw-read-info'
    | 'fw-read'
    | 'fw-verify'
    | 'recover'
    | 'reset'
    | 'erase';

export type OperationResult = 'success' | 'fail';

interface Operation {
    name: string; // operation name
    amountOfSteps: number;
    description: string;
    operation: JlinkOperationName;
    progressPercentage: number;
    duration?: number;
    result?: OperationResult;
    message?: string; // not present in some cases
    step: number;
}

export interface CallbackParameters {
    context: number;
    taskID: number;
    progressJson: Operation;
}
export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [firmware, setFirmware] = useState<object[]>(
        deviceEvaluationChoices(testDevice)[testChoiceIndex].firmware
    );

    const finishedProgramming = firmware.every(f => f.progress === 100);

    useEffect(() => {
        try {
            enumerate(getDeviceLibContext() as unknown as number, {
                jlink: true,
                modem: true,
                serialPorts: true,
            }).then(devices => {
                if (devices.length) {
                    program(
                        devices[0],
                        progress =>
                            progress.taskID < firmware.length &&
                            setFirmware(value => [
                                ...value,
                                {
                                    ...value[progress.taskID],
                                    progressInfo: progress.progressJson,
                                },
                            ]),
                        firmware
                    );
                }
                console.log('no devices');
            });
        } catch (err) {
            console.log('enumerate', err);
        }
    }, []);

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content className="tw-w-full tw-max-w-3xl">
                {finishedProgramming ? (
                    <SuccessContent />
                ) : (
                    <ProgramContent firmware={firmware} />
                )}
            </Main.Content>
            <Main.Footer>
                <Button
                    variant="secondary"
                    disabled={!finishedProgramming}
                    large
                    onClick={back}
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    disabled={!finishedProgramming}
                    large
                    onClick={next}
                >
                    Next
                </Button>
            </Main.Footer>
        </Main>
    );
};
