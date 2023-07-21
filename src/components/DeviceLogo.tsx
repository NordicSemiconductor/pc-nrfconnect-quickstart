/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { deviceLogo } from '../features/devices';

export default ({
    device,
    className = '',
}: {
    device: string;
    className?: string;
}) => {
    const Logo = deviceLogo(device);
    return <Logo className={className} />;
};
