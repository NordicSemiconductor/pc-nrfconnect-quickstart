/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import StepByChoice from '../../StepByChoice';
import Verify from './Verify';

export default (
    config: { ref: string; config: { vComIndex: number; regex: RegExp } }[]
) => ({
    name: 'Verify',
    component: () =>
        StepByChoice({
            steps: config.reduce(
                (acc, next) => ({
                    ...acc,
                    [next.ref]: () => Verify({ ...next.config }),
                }),
                {}
            ),
        }),
});
