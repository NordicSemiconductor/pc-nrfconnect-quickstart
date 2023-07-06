/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';

export default ({ children }: { children: ReactNode }) => (
    <p className="tw-text-lg tw-font-medium">{children}</p>
);
