/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import NRF52 from './nRF52';
import NRF54L15 from './nRF54L15';
import NRF9151 from './nRF9151';
import NRF9160 from './nRF9160';
import NRF9161 from './nRF9161';
import NRF52833 from './nRF52833';
import NRF52840 from './nRF52840';

export interface Flow {
    name: string;
    component: React.FC;
}

export default {
    pca10056: NRF52840,
    pca10100: NRF52833,
    pca10040: NRF52,
    pca10090: NRF9160,
    pca10153: NRF9161,
    pca10171: NRF9151,
    pca10156: NRF54L15,
} as Record<string, Flow[]>;
