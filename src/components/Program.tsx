/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Button } from 'pc-nrfconnect-shared';

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

type TestFirmware = { type: string; name: string; progress: number };

const ProgramContent = ({ firmware }: { firmware: TestFirmware[] }) => (
    <>
        <Heading>Programming...</Heading>
        <p className="tw-pt-4">This might take a few minutes. Please wait.</p>
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-9 tw-pt-10">
            {firmware.map(({ type, name, progress }) => (
                <div key={name} className="tw-flex tw-flex-col tw-gap-1">
                    <div className="tw-flex tw-flex-row tw-justify-between">
                        <p>{type}</p>
                        <p className="tw-text-primary">{name}</p>
                    </div>
                    <ProgressBar percentage={progress} />
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

const testFirmware = [
    { type: 'Modem', name: 'Firmware 1.3.5' },
    { type: 'Application', name: 'Serial LTE Modem' },
];

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [firmware, setFirmware] = useState<TestFirmware[]>(
        testFirmware.map(f => ({ ...f, progress: 0 }))
    );

    const finishedProgramming = firmware.every(f => f.progress === 100);

    useEffect(() => {
        const timeout = setInterval(() => {
            const firstNonFullIndex = firmware.findIndex(
                f => f.progress !== 100
            );
            if (firstNonFullIndex !== -1) {
                setFirmware(
                    firmware.map((f, index) => {
                        if (firstNonFullIndex === index)
                            return { ...f, progress: f.progress + 5 };
                        return f;
                    })
                );
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, [firmware]);

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
