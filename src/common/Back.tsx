/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../app/store';
import { selectDevice } from '../features/device/deviceSlice';
import { goToPreviousStep, isFirstStep } from '../features/steps/stepsSlice';

export const Back = ({
    label,
    disabled,
    onClick,
}: {
    label?: string;
    disabled?: boolean;
    onClick?: (back: () => void) => void;
}) => {
    const dispatch = useAppDispatch();
    const resetDeviceWhenBack = useAppSelector(isFirstStep);
    const back = () => {
        if (resetDeviceWhenBack) {
            dispatch(selectDevice(undefined));
        } else {
            dispatch(goToPreviousStep());
        }
    };

    return (
        <Button
            variant="link-button"
            size="xl"
            disabled={disabled ?? false}
            onClick={() => {
                if (onClick != null) {
                    onClick(back);
                } else {
                    back();
                }
            }}
        >
            {label ?? 'Back'}
        </Button>
    );
};
