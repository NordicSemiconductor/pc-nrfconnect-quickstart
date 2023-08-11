/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button, openUrl } from 'pc-nrfconnect-shared';

import { Choice, deviceLinks, deviceName } from '../features/deviceGuides';
import Heading from './Heading';
import Main from './Main';

export default ({
    back,
    next,
    device,
    choice,
}: {
    back: () => void;
    next: () => void;
    device: Device;
    choice?: Choice;
}) => (
    <Main device={device}>
        <Main.Content>
            <Heading>
                We recommend these resources for learning more about{' '}
                {deviceName(device)}
            </Heading>
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                {deviceLinks(device, choice).map(({ label, href }) => (
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
            <Button variant="secondary" large onClick={back}>
                Back
            </Button>
            <Button variant="primary" large onClick={next}>
                Next
            </Button>
        </Main.Footer>
    </Main>
);
