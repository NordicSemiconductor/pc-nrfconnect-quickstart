/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import Main from './Main';

const content = (
    <div className="tw-flex tw-max-w-xs tw-flex-col tw-justify-center tw-gap-10 tw-text-center">
        <p>
            Get started quickly by updating and verifying functionality,
            installing dependencies, SDK, toolchain and more.
        </p>
        <p>
            Description of what the Quickstart is and option to quit. Quitting
            Quickstart will also open the laucher.
        </p>
    </div>
);

const footer = (
    <div className="tw-flex tw-flex-row tw-justify-center tw-gap-2">
        <Button variant="secondary" large onClick={() => {}}>
            Quit Quickstart
        </Button>
        <Button variant="primary" large onClick={() => {}}>
            Next
        </Button>
    </div>
);

export default () => <Main content={content} footer={footer} />;
