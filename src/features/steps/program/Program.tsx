/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { shell } from '@electron/remote';
import { Progress } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button, Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import Main from '../../../common/Main';
import { getSelectedDeviceUnsafely } from '../../device/deviceSlice';
import { getProgrammingProgress } from './programSlice';

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

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const firmwareProgress = useAppSelector(getProgrammingProgress);

    return (
        <Main device={device}>
            <Main.Content
                heading="Programming"
                className="tw-w-full tw-max-w-3xl"
            >
                <div className="tw-pb-4">
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
                                <div className="tw-flex tw-flex-row tw-items-center tw-justify-between">
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
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
