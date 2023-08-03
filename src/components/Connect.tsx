/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';

import {
    DeviceIcon,
    deviceName,
    isSupportedDevice,
} from '../features/deviceGuides';
import {
    connectedDevicesEvents,
    getConnectedDevices,
} from '../features/deviceLib';
import Heading from './Heading';
import Main from './Main';

const invokeIfSpaceOrEnterPressed =
    (onClick: React.KeyboardEventHandler<Element>) =>
    (event: React.KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === ' ' || event.key === 'Enter') {
            onClick(event);
        }
    };

let firstConnect = true;
const serialIndex = process.argv.findIndex(arg => arg === '--deviceSerial');
const deviceSerial =
    serialIndex > -1 ? process.argv[serialIndex + 1] : undefined;

export default ({ next }: { next: (device: Device) => void }) => {
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
    const [longSearchDuration, setLongSearchDuration] = useState(false);

    const connectAndNext = useCallback(
        (device: Device) => {
            firstConnect = false;
            next(device);
        },
        [next]
    );

    useEffect(() => {
        setConnectedDevices(getConnectedDevices());

        const handler = (devices: Device[]) => {
            const supportedDevices = devices.filter(isSupportedDevice);

            if (deviceSerial && firstConnect) {
                const autoConnectDevice = supportedDevices.find(
                    d => d.serialNumber === deviceSerial
                );
                if (autoConnectDevice) {
                    connectAndNext(autoConnectDevice);
                }
            }

            setConnectedDevices(supportedDevices);
        };
        connectedDevicesEvents.on('update', handler);

        return () => {
            connectedDevicesEvents.removeListener('update', handler);
        };
    }, [connectAndNext]);

    useEffect(() => {
        if (connectedDevices.length) {
            setLongSearchDuration(false);
            return;
        }

        const timeout = setTimeout(() => {
            setLongSearchDuration(true);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [connectedDevices]);

    return (
        <Main>
            <Main.Content>
                <Heading>
                    {connectedDevices.length
                        ? 'Select your kit'
                        : 'Connect a Nordic kit to your PC'}
                </Heading>
                <div className="tw-p-8">
                    <div className="scrollbar tw-max-h-40 tw-w-48 tw-bg-gray-50">
                        {connectedDevices.map(device => (
                            <div
                                key={device.serialNumber}
                                tabIndex={0}
                                role="button"
                                onKeyUp={invokeIfSpaceOrEnterPressed(() =>
                                    connectAndNext(device)
                                )}
                                onClick={() => connectAndNext(device)}
                                className="tw-flex tw-w-full tw-cursor-pointer tw-flex-row tw-items-center tw-gap-1 tw-border-b tw-border-solid tw-px-2 tw-py-1 last:tw-border-b-0 hover:tw-bg-white"
                            >
                                <DeviceIcon
                                    device={device}
                                    className="tw-h-5 tw-w-6 tw-fill-gray-700"
                                />
                                <div className="tw-flex tw-flex-col tw-text-left">
                                    <p>
                                        <b>{deviceName(device)}</b>
                                    </p>
                                    <p>{device.serialNumber}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-gap-4">
                    <p>Searching icon/spinner</p>
                    <p>Searching for devices</p>
                    {longSearchDuration && (
                        <div>
                            <p>This is taking a while.</p>
                            <p>
                                {' '}
                                If this persists, contact support on{' '}
                                <b>
                                    <u>DevZone</u>
                                </b>
                            </p>
                        </div>
                    )}
                </div>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
