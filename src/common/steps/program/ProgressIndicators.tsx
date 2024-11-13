/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import Link from '../../Link';
import {
    getActiveBatchComponent,
    getActiveBatchComponentIndex,
    getError,
    getProgrammingBatchLength,
    getProgrammingProgress,
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

const Header = () => {
    const index = useAppSelector(getActiveBatchComponentIndex);
    const batchComponent = useAppSelector(getActiveBatchComponent);
    const length = useAppSelector(getProgrammingBatchLength);

    if (!batchComponent) return null;

    return (
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-sm">
            <b>
                {index + 1}/{length} {batchComponent.title}
            </b>
            {batchComponent.link && (
                <Link
                    label={batchComponent.link.label}
                    href={batchComponent.link.href}
                />
            )}
        </div>
    );
};

const getProgress = (
    activeIndex: number,
    currentIndex: number,
    progress: number
) => {
    if (activeIndex === currentIndex) {
        return progress;
    }
    if (currentIndex < activeIndex) {
        return 100;
    }
    return 0;
};

export default () => {
    const index = useAppSelector(getActiveBatchComponentIndex);
    const programProgress = useAppSelector(getProgrammingProgress);
    const failed = !!useAppSelector(getError);
    const length = useAppSelector(getProgrammingBatchLength);

    if (!length) return null;

    return (
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-4">
            <Header />
            <div className="tw-flex tw-flex-row tw-gap-2">
                {Array(length)
                    .fill(0)
                    .map((_, i) => (
                        <ProgressBar
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            percentage={getProgress(index, i, programProgress)}
                            failed={failed}
                        />
                    ))}
            </div>
        </div>
    );
};
