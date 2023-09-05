/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    classNames,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

export default ({
    label,
    href,
    color = 'tw-text-gray-700',
}: {
    label: string;
    href: string;
    color?: string;
}) => (
    <a
        target="_blank"
        rel="noreferrer noopener"
        href={href}
        onClick={event => {
            usageData.sendUsageData('Visiting link', href);
            event.stopPropagation();
        }}
        className={classNames('tw-underline', color, `hover:${color}`)}
    >
        {label}
    </a>
);
