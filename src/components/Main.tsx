/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';
import { Logo } from 'pc-nrfconnect-shared';

export default ({
    content,
    footer,
}: {
    content: ReactNode;
    footer: ReactNode;
}) => (
    <div className="tw tw-flex tw-h-full tw-max-h-full tw-flex-col tw-items-center tw-justify-between">
        <div className="tw-flex tw-h-16 tw-w-full tw-items-center tw-justify-between tw-bg-gray-700 tw-px-12 tw-py-4 tw-text-base tw-font-bold tw-uppercase tw-text-white">
            <p>Quickstart</p>
            <div className="tw-h-10 tw-w-10">
                <Logo />
            </div>
        </div>
        <div className="tw-m-4 tw-text-sm">{content}</div>
        <div className="tw-mb-8"> {footer}</div>
    </div>
);
