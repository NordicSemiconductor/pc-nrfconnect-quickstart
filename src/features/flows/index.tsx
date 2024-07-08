/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import NRF9151 from './nRF9151';
import NRF9160 from './nRF9160';
import NRF9161 from './nRF9161';

export interface Flow {
    name: string;
    component: React.FC;
}

export default {
    pca10090: NRF9160,
    pca10153: NRF9161,
    pca10171: NRF9151,
} as Record<string, Flow[]>;
