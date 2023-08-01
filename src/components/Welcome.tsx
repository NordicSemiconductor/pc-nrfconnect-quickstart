/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import Main from './Main';

export default ({ next, quit }: { next: () => void; quit: () => void }) => (
    <Main>
        <Main.Content className="tw-max-w-sm tw-gap-4">
            <p>
                Get started quickly by updating and verifying functionality,
                installing dependencies, SDK, toolchain and more.
            </p>
            <p>
                Description of what the Quickstart is and option to quit.
                Quitting Quickstart will also open the laucher.
            </p>
        </Main.Content>
        <Main.Footer>
            <Button variant="secondary" large onClick={quit}>
                Quit Quickstart
            </Button>
            <Button variant="primary" large onClick={next}>
                Next
            </Button>
        </Main.Footer>
    </Main>
);
