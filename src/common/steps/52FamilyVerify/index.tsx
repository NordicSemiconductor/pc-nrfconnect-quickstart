/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import StepByChoice from '../../StepByChoice';

export default ({
    config,
}: {
    config: { ref: string; component: () => React.ReactNode }[];
}) => ({
    name: 'Verify',
    component: StepByChoice({
        steps: config.reduce(
            (acc, next) => ({
                ...acc,
                [next.ref]: next.component,
            }),
            {}
        ),
    }),
});
