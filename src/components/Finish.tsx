/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import Main from './Main';

export default ({ back }: { back: () => void }) => (
    <Main>
        <Main.Header />
        <Main.Content>
            <h1 className="tw-text-lg tw-font-medium">Finished Quickstart</h1>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-pt-10">
                <p>You now have finished all the steps</p>
                <p>
                    Quickstart can be opened at any time from nRF Connect for
                    Desktop
                </p>
                <p>
                    Please leave{' '}
                    <u>
                        <strong>feedback</strong>
                    </u>{' '}
                    if you have suggestions for how we can make the getting
                    started experience better
                </p>
            </div>
        </Main.Content>
        <Main.Footer>
            <Button variant="secondary" large onClick={back}>
                Back
            </Button>
            <Button variant="primary" large onClick={() => {}}>
                Exit and open nRF Connect for Desktop
            </Button>
        </Main.Footer>
    </Main>
);
