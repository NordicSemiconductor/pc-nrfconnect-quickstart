/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

export interface Flow {
    name: string;
    component: React.FC;
}

export default {} as Record<string, Flow[]>;
