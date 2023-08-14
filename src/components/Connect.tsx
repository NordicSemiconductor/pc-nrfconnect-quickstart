/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { isSupportedDevice } from '../features/deviceGuides';
import {
    connectedDevicesEvents,
    getConnectedDevices,
} from '../features/deviceLib';
import Heading from './Heading';
import Main from './Main';

export default ({ next }: { next: (device: Device) => void }) => {
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
    const [longSearchDuration, setLongSearchDuration] = useState(false);
    const [hasWaitedMinDuration, setHasWaitedMinDuration] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasWaitedMinDuration(true);
        }, 3000);
    }, []);

    useEffect(() => {
        if (hasWaitedMinDuration && connectedDevices.length) {
            next(connectedDevices[0]);
        }
    }, [hasWaitedMinDuration, connectedDevices, next]);

    useEffect(() => {
        setConnectedDevices(getConnectedDevices());

        const handler = (devices: Device[]) => {
            const supportedDevices = devices.filter(isSupportedDevice);

            setConnectedDevices(supportedDevices);
        };
        connectedDevicesEvents.on('update', handler);

        return () => {
            connectedDevicesEvents.removeListener('update', handler);
        };
    }, []);

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
                <Heading>Connect a Nordic kit to your PC</Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-pt-4">
                    <Spinner size="sm" />
                    <p>Searching for devices</p>
                    {longSearchDuration && (
                        <div>
                            <p>This is taking a while.</p>
                            <p>
                                Make sure one of the supported devices is
                                connected: nRF9160DK
                            </p>
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
