/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { shell } from '@electron/remote';
import { Device, Progress } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button } from 'pc-nrfconnect-shared';

import { Firmware } from '../../features/deviceGuides';
import { program } from '../../features/deviceLib';
import Heading from '../Heading';
import Main from '../Main';

// TODO: can be removed when device lib types are updated
interface ExtendedOperation extends Progress.Operation {
    state: string;
    operationId: string;
}

type FirmwareWithProgress = Firmware & {
    progressInfo?: ExtendedOperation;
};

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className="tw-h-full tw-bg-primary"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const getPercentage = (progressInfo: ExtendedOperation) =>
    ((progressInfo.step - 1) / progressInfo.amountOfSteps) * 100 +
    (1 / progressInfo.amountOfSteps) * progressInfo.progressPercentage;

const ProgramContent = ({ firmware }: { firmware: FirmwareWithProgress[] }) => (
    <>
        <Heading>Programming</Heading>
        <div className="tw-py-4">
            <Spinner size="sm" animation="border" />
        </div>
        <p>This might take a few minutes. Please wait.</p>
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-9 tw-pt-10">
            {firmware.map(({ file, format, link, progressInfo }) => (
                <div key={file} className="tw-flex tw-flex-col tw-gap-1">
                    <div className="tw-flex tw-flex-row tw-justify-between">
                        <p>{format}</p>
                        <Button
                            variant="link"
                            large
                            onClick={() => {
                                shell.openExternal(link);
                            }}
                        >
                            {file}
                        </Button>
                    </div>
                    <ProgressBar
                        percentage={
                            progressInfo ? getPercentage(progressInfo) : 0
                        }
                    />
                </div>
            ))}
        </div>
    </>
);

const SuccessContent = () => (
    <>
        <Heading>Success!</Heading>
        <div className="tw-max-w-sm tw-pt-10">
            <p>Device was programmed successfully.</p>
        </div>
    </>
);

export default ({
    back,
    next,
    device,
    selectedFirmware,
}: {
    back: () => void;
    next: () => void;
    device: Device;
    selectedFirmware: Firmware[];
}) => {
    const [firmware, setFirmware] =
        useState<FirmwareWithProgress[]>(selectedFirmware);
    const [finishedProgramming, setFinishedProgramming] = useState(false);

    useEffect(() => {
        if (selectedFirmware.length === 0) return;

        try {
            program(
                device,
                selectedFirmware,
                progress => {
                    const taskId = Number.parseInt(
                        // TODO: can be removed when device lib types are updated
                        (progress.progressJson as ExtendedOperation)
                            .operationId,
                        10
                    );
                    if (taskId < selectedFirmware.length)
                        setFirmware(value =>
                            value.map((f, index) =>
                                index === taskId
                                    ? {
                                          ...f,
                                          progressInfo:
                                              // TODO: can be removed when device lib types are updated
                                              progress.progressJson as ExtendedOperation,
                                      }
                                    : f
                            )
                        );
                },
                err => {
                    if (err) {
                        throw err;
                    } else {
                        setTimeout(() => setFinishedProgramming(true), 1000);
                    }
                }
            );
        } catch (err) {
            console.log('Failed to program:', err);
        }
    }, [device, selectedFirmware]);

    return (
        <Main device={device}>
            <Main.Content className="tw-w-full tw-max-w-3xl">
                {finishedProgramming ? (
                    <SuccessContent />
                ) : (
                    <ProgramContent firmware={firmware} />
                )}
            </Main.Content>
            <Main.Footer>
                {finishedProgramming && (
                    <>
                        <Button variant="secondary" large onClick={back}>
                            Back
                        </Button>
                        <Button variant="primary" large onClick={next}>
                            Next
                        </Button>
                    </>
                )}
            </Main.Footer>
        </Main>
    );
};
