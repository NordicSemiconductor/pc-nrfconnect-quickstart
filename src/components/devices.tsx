/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

// @ts-expect-error svg imports are fine
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Logo91 from '!!@svgr!../../resources/nRF91-Series-logo.svg';

const devices = [
    {
        device: 'nRF9161 DK',
        logo: Logo91,
        apps: [
            'cellularmonitor',
            'serial-terminal',
            'programmer',
            'IdentityProvisioning',
        ],
    },
];

export const deviceApps = (device: string) =>
    devices.find(({ device: d }) => d === device)?.apps ?? [];

export const deviceLogo = (device: string) =>
    devices.find(({ device: d }) => d === device)?.logo;
