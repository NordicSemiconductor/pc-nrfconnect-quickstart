/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    classNames,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

export const DevZoneLink = () => (
    <Link
        label="DevZone"
        color="tw-text-primary"
        href="https://devzone.nordicsemi.com/support/add"
    />
);

const Link = ({
    label,
    href,
    color = 'tw-text-gray-700',
}: {
    label: string | React.ReactNode;
    href: string;
    color?: string;
}) => (
    <a
        target="_blank"
        rel="noreferrer noopener"
        href={href}
        title={href}
        onClick={event => {
            telemetry.sendEvent('Visiting link', { href });
            event.stopPropagation();
        }}
        className={classNames('tw-underline', color, `hover:${color}`)}
    >
        {label}
    </a>
);

export default Link;
