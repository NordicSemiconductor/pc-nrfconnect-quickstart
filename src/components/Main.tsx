/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { getPersistedNickname, Logo } from 'pc-nrfconnect-shared';

import { DeviceLogo, deviceName } from '../features/devicesGuides';
import { getSelectedDevice } from '../features/deviceSlice';

const Header = ({ showDevice }: { showDevice?: boolean }) => {
    const device = useSelector(getSelectedDevice);

    return (
        <div className="tw-flex tw-h-16 tw-w-full tw-flex-row tw-items-center tw-justify-around tw-bg-gray-700 tw-px-12 tw-py-4 tw-text-base tw-text-white">
            <p className="tw-flex-1 tw-font-bold tw-uppercase">Quickstart</p>
            {showDevice && device && (
                <div className="tw-flex tw-flex-row tw-items-center tw-gap-3">
                    <DeviceLogo
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
};

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
