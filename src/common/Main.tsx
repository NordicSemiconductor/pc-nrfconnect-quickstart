/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';
import {
    getPersistedNickname,
    Logo,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { NrfutilDeviceWithSerialnumber } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';

import { DeviceIcon, deviceName } from '../features/device/deviceGuides';

const Header = ({ device }: { device?: NrfutilDeviceWithSerialnumber }) => (
    <div className="tw-flex tw-h-16 tw-w-full tw-flex-row tw-items-center tw-justify-around tw-bg-gray-700 tw-px-12 tw-py-4 tw-text-base tw-text-white">
        <p className="tw-flex-1 tw-font-bold tw-uppercase">Quickstart</p>
        {device && (
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-3">
                <DeviceIcon
                    device={device}
                    className="tw-h-5 tw-w-6 tw-fill-white"
                />
                <p>
                    {getPersistedNickname(device.serialNumber) ||
                        deviceName(device)}
                </p>
            </div>
        )}
        <div className="tw-flex tw-flex-1 tw-flex-row tw-justify-end">
            <div className="tw-h-10 tw-w-10">
                <Logo />
            </div>
        </div>
    </div>
);

const Content = ({
    heading,
    subHeading,
    className = '',
    children,
}: {
    heading: string;
    subHeading?: string;
    className?: string;
    children: ReactNode;
}) => (
    <div
        className={`tw-flex tw-flex-col tw-items-start tw-justify-start tw-overflow-hidden tw-pb-8 tw-pr-6 tw-text-start tw-text-sm tw-text-gray-700 ${className}`}
    >
        <h1 className="tw-pb-4 tw-text-2xl tw-font-medium tw-leading-none">
            {heading}
        </h1>
        <h2 className="tw-pb-8">{subHeading || '‎'}</h2>
        <div className="scrollbar tw-w-full">{children}</div>
    </div>
);

const Footer = ({
    className = '',
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => (
    <div
        className={`tw-flex tw-flex-row tw-justify-end tw-gap-2 tw-pr-10 ${className}`}
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
    device?: NrfutilDeviceWithSerialnumber;
}) => (
    <div
        className={`tw-flex tw-h-full tw-max-h-full tw-flex-col tw-justify-between tw-py-10 tw-pl-10 ${className}`}
    >
        {children}
    </div>
);

Main.Content = Content;
Main.Footer = Footer;

export default Main;
