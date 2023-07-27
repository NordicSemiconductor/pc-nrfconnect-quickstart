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
import type { Firmware } from '../features/devicesGuides';
import { getSelectedDevice } from '../features/deviceSlice';
import Heading from './Heading';
import Main from './Main';

interface FirmwareWithProgress extends Firmware {
    progressInfo: {
        progressPercentage: number;
    };
}

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className="tw-h-full tw-bg-primary"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const ProgramContent = ({ firmware }: { firmware: FirmwareWithProgress[] }) => (
    <>
        <Heading>Programming...</Heading>
        <p className="tw-pt-4">This might take a few minutes. Please wait.</p>
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-9 tw-pt-10">
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

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const device = useSelector(getSelectedDevice);
    const choice = useSelector(getSelectedChoice);
    const [firmware, setFirmware] = useState<FirmwareWithProgress[]>([]);

    useEffect(() => {
        if (!choice) return;
        setFirmware(
            choice.firmware.map(f => ({
                ...f,
                progressInfo: { progressPercentage: 0 },
            }))
        );
    }, [choice]);

    useEffect(() => {
        if (!device || !choice || choice.firmware.length === 0) return;

        try {
            program(
                device,
                choice.firmware,
                progress =>
                    progress.taskID < choice.firmware.length &&
                    setFirmware(value => [
                        ...value,
                        {
                            ...value[progress.taskID],
                            progressInfo: progress.progressJson,
                        },
                    ])
            );
        } catch (err) {
            console.log('Failed to program:', err);
        }
    }, [device, choice]);

    const finishedProgramming =
        firmware.length &&
        firmware.every(f => f.progressInfo.progressPercentage === 100);

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
