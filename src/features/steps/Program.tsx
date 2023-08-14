/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useMemo, useState } from 'react';
import { shell } from '@electron/remote';
import { Progress } from '@nordicsemiconductor/nrf-device-lib-js';
import {
    Button,
    describeError,
    Spinner,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import type { Firmware } from '../device/deviceGuides';
import { program } from '../device/deviceLib';
import {
    getChoice,
    getConnectedDevices,
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

const ProgramContent = ({
    firmware,
    onFinished,
}: {
    firmware: Firmware[];
    onFinished: (error?: unknown) => void;
}) => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [firmwareProgress, setFirmwareProgress] =
        useState<FirmwareWithProgress[]>(firmware);

    useEffect(() => {
        try {
            program(
                device,
                firmware,
                progress => {
                    if (!progress.progressJson.operationId) return;

                    const taskId = Number.parseInt(
                        progress.progressJson.operationId,
                        10
                    );
                    if (taskId < firmware.length)
                        setFirmwareProgress(value =>
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
                onFinished
            );
        } catch (err) {
            onFinished(err);
        }
    });

    return (
        <>
            <Heading>Programming</Heading>
            <div className="tw-py-4">
                <Spinner size="sm" />
            </div>
            <p>This might take a few minutes. Please wait.</p>
            <div className="tw-flex tw-w-full tw-flex-col tw-gap-9 tw-pt-10">
                {firmwareProgress.map(
                    ({ file, format, link, progressInfo }) => (
                        <div
                            key={file}
                            className="tw-flex tw-flex-col tw-gap-1"
                        >
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
                                    progressInfo
                                        ? getPercentage(progressInfo)
                                        : 0
                                }
                            />
                        </div>
                    )
                )}
            </div>
        </>
    );
};

const ErrorContent = ({ error }: { error: unknown }) => (
    <>
        <Heading>Failed to program device</Heading>
        <div className="tw-max-w-sm tw-pt-10">
            <p>{describeError(error)}</p>
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

const WaitForDevice = () => (
    <>
        <Heading>No device connected</Heading>
        <div className="tw-flex tw-max-w-sm tw-flex-col tw-justify-center tw-gap-4 tw-pt-10">
            <Spinner size="sm" />
            <p>Ensure that your device is connected</p>
        </div>
    </>
);

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const connectedDevices = useAppSelector(getConnectedDevices);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- It is impossible to progress without having made a choice
    const selectedFirmware = useAppSelector(getChoice)!.firmware;

    const selectedDeviceIsConnected = useMemo(
        () =>
            connectedDevices.some(
                connectedDevice =>
                    connectedDevice.serialNumber === device.serialNumber
            ),
        [connectedDevices, device]
    );

    const [programmingState, setProgrammingState] = useState<
        'idle' | 'progress' | 'success' | 'error'
    >(selectedDeviceIsConnected ? 'progress' : 'idle');
    const [programmingError, setProgrammingError] = useState<
        unknown | undefined
    >();

    return (
        <Main device={device}>
            <Main.Content className="tw-w-full tw-max-w-3xl">
                {programmingState === 'idle' && <WaitForDevice />}
                {programmingState === 'progress' && (
                    <ProgramContent
                        firmware={selectedFirmware}
                        onFinished={error => {
                            if (error) {
                                /* Currently this is not usable as multiple error messages
                                 * can be returned for a single successful batch operation */

                                // setProgrammingError(error);
                                // setProgrammingState('error');

                                setProgrammingState('success');
                            } else {
                                setProgrammingState('success');
                            }
                        }}
                    />
                )}
                {programmingState === 'success' && <SuccessContent />}
                {programmingState === 'error' && programmingError && (
                    <ErrorContent error={programmingError} />
                )}
            </Main.Content>
            <Main.Footer>
                {programmingState === 'success' && (
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
