/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import Heading from './Heading';
import Main from './Main';

export default ({ back, next }: { back: () => void; next: () => void }) => (
    <Main>
        <Main.Header showDevice />
        <Main.Content>
            <Heading>Install nRF Connect SDK and Toolchain</Heading>
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                <p>
                    The nRF Connect SDK is where you begin building low-power
                    wireless applications with Nordic Semiconductor.
                </p>
                <p>
                    The Toolchain Manager app is used to install and manage IDE,
                    SDK, Toolchain and dependencies.
                </p>
                <p>
                    Launch the app and install the latest version. Follow the
                    instructions in the Toolchain Manager app to complete the
                    setup of Ide, SDK and Toolchain.
                </p>
            </div>
        </Main.Content>
        <Main.Footer>
            <Button variant="secondary" large onClick={back}>
                Back
            </Button>
            <Button
                variant="primary"
                large
                onClick={() => {
                    // TODO: Launch Toolchain Manager

                    next();
                }}
            >
                Launch Toolchain Manager
            </Button>
        </Main.Footer>
    </Main>
);
