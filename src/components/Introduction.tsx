/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

import { DeviceLogo, deviceName } from '../features/deviceGuides';
import { getSelectedDevice } from '../features/deviceSlice';
import Heading from './Heading';
import Main from './Main';

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const device = useSelector(getSelectedDevice);
    // device can never be undefined here
    if (!device) return null;

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content>
                <div className="tw-pb-10">
                    <DeviceLogo
                        device={device}
                        className="tw-h-14 tw-w-20 tw-fill-gray-700"
                    />
                </div>
                <Heading>
                    Let&apos;s get started with the {deviceName(device)}
                </Heading>
                <div className="tw-max-w-sm tw-pt-10">
                    <p>\\Device capabilities//</p>
                </div>
            </Main.Content>
            <Main.Footer className="tw-gap-20">
                <Button variant="secondary" large onClick={back}>
                    Back
                </Button>
                <Button variant="primary" large onClick={next}>
                    Next
                </Button>
            </Main.Footer>
        </Main>
    );
};
