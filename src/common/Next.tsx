/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    ButtonVariants,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch } from '../app/store';
import { goToNextStep } from '../features/steps/stepsSlice';

export const Next = ({
    disabled,
    label,
    onClick,
    variant,
}: {
    disabled?: boolean;
    label?: string;
    onClick?: (next: () => void) => void;
    variant?: ButtonVariants;
}) => {
    const dispatch = useAppDispatch();
    const next = () => dispatch(goToNextStep());

    return (
        <Button
            disabled={disabled ?? false}
            variant={variant ?? 'primary'}
            large
            onClick={() => {
                if (onClick != null) {
                    onClick(next);
                } else {
                    next();
                }
            }}
        >
            {label ?? 'Next'}
        </Button>
    );
};
