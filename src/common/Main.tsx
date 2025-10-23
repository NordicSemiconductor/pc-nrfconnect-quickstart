/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { ReactNode } from 'react';

import { useAppSelector } from '../app/store';
import { selectedDeviceIsConnected } from '../features/device/deviceSlice';

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
    <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-overflow-hidden tw-pb-8 tw-pr-6 tw-text-start tw-text-sm tw-text-gray-700">
        <h1 className="tw-pb-4 tw-text-2xl/6 tw-font-medium">{heading}</h1>
        <h2 className="tw-pb-8">{subHeading || '‎'}</h2>
        <div className={`scrollbar tw-w-full ${className}`}>{children}</div>
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

const OnDeviceDisconnected = () => <div />;

const Main = ({
    className = '',
    detectDisconnectedDevice = false,
    children,
}: {
    className?: string;
    detectDisconnectedDevice?:
        | boolean
        | {
              onConnectionStatusChanged: (connected: boolean) => {
                  showDisconnectView: boolean;
              } | void;
          };
    children: ReactNode;
}) => {
    const deviceConnected = useAppSelector(selectedDeviceIsConnected);

    const showDisconnectView = () => {
        if (deviceConnected) return false;
        if (detectDisconnectedDevice === undefined) return !deviceConnected;
        if (detectDisconnectedDevice) {
            if (typeof detectDisconnectedDevice === 'boolean') {
                return detectDisconnectedDevice;
            } else   {
                const result =
                    detectDisconnectedDevice.onConnectionStatusChanged(
                        deviceConnected
                    );
                return result ? result.showDisconnectView : !deviceConnected;
            }
        }
        return false;
    };

    return (
        <div
            className={`tw-flex tw-h-full tw-max-h-full tw-flex-col tw-justify-between tw-py-10 tw-pl-10 ${className}`}
        >
            <div
                className={`tw-flex tw-h-full tw-max-h-full tw-flex-col tw-justify-between ${
                    // Hide content to preserve nested useState states resetting
                    showDisconnectView() ? 'tw-opacity-0' : ''
                }`}
            >
                {children}
            </div>
            {showDisconnectView() && <OnDeviceDisconnected />}
        </div>
    );
};

Main.Content = Content;
Main.Footer = Footer;

export default Main;
