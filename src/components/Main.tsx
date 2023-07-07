/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';
import { Logo } from 'pc-nrfconnect-shared';

const Header = () => (
    <div className="tw-flex tw-h-16 tw-w-full tw-items-center tw-justify-between tw-bg-gray-700 tw-px-12 tw-py-4 tw-text-base tw-font-bold tw-uppercase tw-text-white">
        <p>Quickstart</p>
        <div className="tw-h-10 tw-w-10">
            <Logo />
        </div>
    </div>
);

const Content = ({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) => (
    <div
        className={`tw-flex tw-max-w-xs tw-flex-col tw-justify-center tw-p-8 tw-text-center tw-text-sm tw-text-gray-700 ${className}`}
    >
        {children}
    </div>
);

const Footer = ({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) => (
    <div
        className={`tw-flex tw-flex-row tw-gap-2 tw-px-8 tw-pb-8 ${className}`}
    >
        {children}
    </div>
);

const Main = ({
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) => (
    <div
        className={`tw tw-flex tw-h-full tw-max-h-full tw-flex-col tw-items-center tw-justify-between ${className}`}
    >
        {children}
    </div>
);

Main.Header = Header;
Main.Content = Content;
Main.Footer = Footer;

export default Main;
