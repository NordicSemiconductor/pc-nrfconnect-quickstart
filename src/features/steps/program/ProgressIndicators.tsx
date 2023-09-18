/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import Link from '../../../common/Link';
import {
    getProgrammingProgress,
    getProgrammingState,
    ProgrammingState,
} from './programSlice';

const ProgressBar = ({
    percentage,
    failed,
}: {
    percentage: number;
    failed?: boolean;
}) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className={classNames(
                'tw-h-full',
                percentage < 100 && failed && 'tw-bg-red',
                percentage < 100 && !failed && 'tw-bg-primary',
                percentage >= 100 && 'tw-bg-green'
            )}
            style={{ width: `${failed ? 100 : percentage}%` }}
        />
    </div>
);

export default () => {
    const programmingState = useAppSelector(getProgrammingState);
    const firmwareProgress = useAppSelector(getProgrammingProgress);

    return (
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-9">
            {firmwareProgress.map(({ file, core, link, progress }) => (
                <div key={file} className="tw-flex tw-flex-col tw-gap-1">
                    <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-sm">
                        <p>{core} core</p>
                        <Link label={link.label} href={link.href} />
                    </div>
                    <ProgressBar
                        percentage={progress?.totalProgressPercentage || 0}
                        failed={programmingState === ProgrammingState.ERROR}
                    />
                </div>
            ))}
        </div>
    );
};
