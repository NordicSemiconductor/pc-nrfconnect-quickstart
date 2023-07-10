/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import DeviceLogo from './DeviceLogo';
import Heading from './Heading';
import Main from './Main';

const testingDevice = 'nRF9161 DK';

export default ({ back, next }: { back: () => void; next: () => void }) => (
    <Main>
        <Main.Header showDevice />
        <Main.Content>
            <div className="tw-pb-10">
                <DeviceLogo
                    device={testingDevice}
                    className="tw-h-14 tw-w-20 tw-fill-gray-700"
                />
            </div>
            <Heading>Let&apos;s get started with the \\device//</Heading>
            <div className="tw-pt-10">
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
