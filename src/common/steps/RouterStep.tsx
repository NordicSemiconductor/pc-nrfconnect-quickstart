/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import StepByChoice from '../StepByChoice';

export default <T extends object>(
    name: string,
    pages: (
        | {
              ref: string;
              config: T;
          }
        | { ref: string; component: () => React.ReactNode }
    )[],
    defaultStep: (params: T) => { component: () => React.ReactNode }
) => ({
    name,
    component: () =>
        StepByChoice({
            steps: pages.reduce(
                (acc, next) => ({
                    ...acc,
                    [next.ref]:
                        'config' in next
                            ? () => defaultStep({ ...next.config })
                            : next.component,
                }),
                {}
            ),
        }),
});
