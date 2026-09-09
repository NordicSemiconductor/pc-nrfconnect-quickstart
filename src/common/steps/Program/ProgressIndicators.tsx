/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button, classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { getSelectedDeviceUnsafely } from '../../../features/device/deviceSlice';
import Link from '../../Link';
import { runProgrammingAction } from './actionVariants/actionList';
import {
    getCurrentAction,
    getError,
    getProgrammingProgress,
} from './programSlice';

const ProgressBar = ({
    percentage,
    failed,
    skipped,
}: {
    percentage: number;
    failed?: boolean;
    skipped?: boolean;
}) => (
    <div className="tw-h-1 tw-w-full tw-bg-gray-50">
        <div
            className={classNames(
                'tw-h-full',
                skipped && !failed && 'tw-bg-amber',
                percentage < 100 && failed && !skipped && 'tw-bg-red',
                percentage < 100 && !failed && !skipped && 'tw-bg-primary',
                percentage >= 100 && 'tw-bg-green',
            )}
            style={{ width: `${failed || skipped ? 100 : percentage}%` }}
        />
    </div>
);

const Confirm = ({ text }: { text: string }) => {
    const dispatch = useAppDispatch();
    const currentAction = useAppSelector(getCurrentAction);
    const device = useAppSelector(getSelectedDeviceUnsafely);
    if (
        !!currentAction &&
        'config' in currentAction &&
        currentAction.config.type === 'custom' &&
        currentAction.config.onConfirm &&
        currentAction.config.onCancel
    ) {
        const { onConfirm, onCancel } = currentAction.config;
        return (
            <div className="tw-bg-linear-to-b tw-flex tw-flex-row tw-gap-2 tw-rounded-md tw-border-b tw-border-l tw-border-r tw-from-white tw-to-primary">
                {text}
                <div className="tw-flex tw-flex-row tw-gap-1">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            if (typeof onCancel === 'function')
                                dispatch(onCancel(device));
                            else
                                dispatch(
                                    runProgrammingAction(device, onCancel),
                                );
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            if (typeof onConfirm === 'function')
                                dispatch(onConfirm(device));
                            else
                                dispatch(
                                    runProgrammingAction(device, onConfirm),
                                );
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};

export default () => {
    const programProgress = useAppSelector(getProgrammingProgress);
    const failed = !!useAppSelector(getError);

    return (
        <div
            className={`tw-flex tw-w-full tw-flex-col ${
                programProgress.length === 4 ? 'tw-gap-[15px]' : 'tw-gap-8'
            }`}
        >
            {programProgress.map(
                ({ title, link, progress, confirm, skipped }) => (
                    <div key={title} className="tw-flex tw-flex-col tw-gap-1">
                        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-sm">
                            <p>{title}</p>
                            {link && (
                                <Link label={link.label} href={link.href} />
                            )}
                        </div>
                        <ProgressBar
                            percentage={progress}
                            failed={failed}
                            skipped={skipped}
                        />
                        {confirm?.visible && !failed && !skipped && (
                            <Confirm text={confirm.text} />
                        )}
                    </div>
                ),
            )}
        </div>
    );
};
