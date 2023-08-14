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

import { DeviceIcon, deviceName } from '../features/device/deviceGuides';
import { DeviceWithRequiredSerialNumber } from '../features/device/deviceSlice';

const Header = ({ device }: { device?: DeviceWithRequiredSerialNumber }) => (
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
    className = '',
    children,
}: {
    className?: string;
    children: ReactNode;
}) => (
    <div
        className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-8 tw-text-center tw-text-sm tw-text-gray-700 ${className}`}
    >
        {children}
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
        className={`tw-flex tw-flex-row tw-gap-2 tw-px-8 tw-pb-8 ${className}`}
    >
        {children}
    </div>
);

const Main = ({
    className = '',
    children,
    device,
}: {
    className?: string;
    children: ReactNode;
    device?: DeviceWithRequiredSerialNumber;
}) => (
    <div
        className={`tw tw-flex tw-h-full tw-max-h-full tw-flex-col tw-items-center tw-justify-between ${className}`}
    >
        <Header device={device} />
        {children}
    </div>
);

Main.Content = Content;
Main.Footer = Footer;

export default Main;
