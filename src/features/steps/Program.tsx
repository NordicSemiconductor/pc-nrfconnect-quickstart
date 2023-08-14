/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { shell } from '@electron/remote';
import { Progress } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import type { Firmware } from '../device/deviceGuides';
import { program } from '../device/deviceLib';
import {
    getChoice,
    getSelectedDeviceUnsafely,
    setChoice,
} from '../device/deviceSlice';

type FirmwareWithProgress = Firmware & {
    progressInfo?: Progress.Operation;
};

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className="tw-h-full tw-bg-primary"
            style={{ width: `${percentage}%` }}
        />
    </div>
);

const getPercentage = (progressInfo: Progress.Operation) =>
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

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice
    const selectedFirmware = useAppSelector(getChoice)!.firmware;

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
                    if (!progress.progressJson.operationId) return;

                    const taskId = Number.parseInt(
                        progress.progressJson.operationId,
                        10
                    );
                    if (taskId < selectedFirmware.length)
                        setFirmware(value =>
                            value.map((f, index) =>
                                index === taskId
                                    ? {
                                          ...f,
                                          progressInfo: progress.progressJson,
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
                        <Back
                            onClick={back => {
                                dispatch(setChoice(undefined));
                                back();
                            }}
                        />
                        <Next />
                    </>
                )}
            </Main.Footer>
        </Main>
    );
};
