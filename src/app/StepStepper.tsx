/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getCurrentStep, steps } from '../features/steps/stepsSlice';
import { useAppSelector } from './store';

const Line = ({ dark = true }: { dark?: boolean }) => (
    <div
        className={classNames(
            'tw-ml-[9px]',
            'tw-w-0.5',
            'tw-flex-1',
            dark ? 'tw-bg-gray-600' : 'tw-bg-gray-200'
        )}
    />
);

const Step = ({
    label,
    relativeToCurrent,
    isLast = false,
}: {
    label: (typeof steps)[number];
    relativeToCurrent: number;
    isLast?: boolean;
}) => (
    <div
        className={classNames(
            'tw-flex tw-flex-col',
            !isLast ? 'tw-h-full' : ''
        )}
    >
        <div className="tw-flex tw-flex-row tw-items-center">
            <div className="tw-relative">
                <span
                    className={classNames(
                        relativeToCurrent <= 0
                            ? 'tw-text-gray-200'
                            : 'tw-text-gray-500',
                        'mdi mdi-circle tw-relative tw-top-0.5 tw-z-0 tw-text-xl tw-leading-none'
                    )}
                />
                {relativeToCurrent <= 0 && (
                    <span
                        className={classNames(
                            relativeToCurrent === 0
                                ? 'mdi-circle tw-left-1.5 tw-top-1.5 tw-text-[8px]'
                                : 'mdi-check-bold tw-left-[5px] tw-top-1 tw-text-[10px]',
                            'mdi tw-absolute tw-z-10 tw-text-gray-900'
                        )}
                    />
                )}
            </div>
            <p
                className={classNames(
                    relativeToCurrent <= 0
                        ? 'tw-text-gray-200'
                        : 'tw-text-gray-500',
                    'tw-col-span tw-pl-3.5 tw-text-xs tw-font-medium tw-tracking-wide'
                )}
            >
                {label}
            </p>
        </div>
        {!isLast && <Line dark={relativeToCurrent >= 0} />}
    </div>
);

export default () => {
    const currentStep = useAppSelector(getCurrentStep);
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div className="tw-flex tw-flex-col tw-items-start tw-bg-gray-900 tw-p-10">
            {steps.map((step, index) => (
                <Step
                    key={step}
                    label={step}
                    relativeToCurrent={index - currentStepIndex}
                    isLast={index === steps.length - 1}
                />
            ))}
        </div>
    );
};