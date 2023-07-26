/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

import { getSelectedChoice } from '../features/choiceSlice';
import { program } from '../features/deviceLib';
import { getSelectedDevice } from '../features/deviceSlice';
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
            {firmware.map(({ format, file, progressInfo }) => (
                <div key={file} className="tw-flex tw-flex-col tw-gap-1">
                    <div className="tw-flex tw-flex-row tw-justify-between">
                        <p>{format}</p>
                        <p className="tw-text-primary">{file}</p>
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
    const device = useSelector(getSelectedDevice);
    const choice = useSelector(getSelectedChoice);
    const [firmware, setFirmware] = useState<
        {
            format: string;
            file: string;
            progressInfo: { progressPercentage: number };
        }[]
    >([]);

    useEffect(() => {
        if (!choice) return;
        setFirmware(
            choice.firmware.map(f => ({
                ...f,
                progressInfo: { progressPercentage: 0 },
            }))
        );
    }, [choice]);

    const finishedProgramming =
        firmware.length &&
        firmware.every(f => f.progressInfo.progressPercentage === 100);

    useEffect(() => {
        // device can never be undefined here
        if (!device || firmware.length === 0) return;

        try {
            program(
                device,
                firmware,
                progress =>
                    // @ts-expect-error no type definitions for this yet
                    progress.taskID < firmware.length &&
                    setFirmware(value => [
                        ...value,
                        {
                            // @ts-expect-error no type definitions for this yet
                            ...value[progress.taskID],
                            // @ts-expect-error no type definitions for this yet
                            progressInfo: progress.progressJson,
                        },
                    ])
            );
        } catch (err) {
            console.log('enumerate', err);
        }
    }, [firmware, device]);

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
