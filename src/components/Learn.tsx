/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button, openUrl } from 'pc-nrfconnect-shared';

import { useAppSelector } from '../app/store';
import { deviceLinks, deviceName } from '../features/device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../features/device/deviceSlice';
import { Back } from './Back';
import Heading from './Heading';
import Main from './Main';
import { Next } from './Next';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    return (
        <Main device={device}>
            <Main.Content>
                <Heading>
                    We recommend these resources for learning more about{' '}
                    {deviceName(device)}
                </Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                    {deviceLinks(device).map(({ label, href }) => (
                        <Button
                            key={label}
                            variant="link-button"
                            onClick={() => openUrl(href)}
                            large
                            className="tw-w-96 tw-text-left"
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
