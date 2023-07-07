/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button, openUrl } from 'pc-nrfconnect-shared';

import Heading from './Heading';
import Main from './Main';

const links = [
    { label: 'Nordic Academy - Cellular IoT Fundamentals', href: '' },
    { label: 'Nordic Academy - nRF Connect SDK Fundamentals', href: '' },
    { label: 'Infocenter - \\\\Device// Hardware Details', href: '' },
];

export default ({ back, next }: { back: () => void; next: () => void }) => (
    <Main>
        <Main.Header />
        <Main.Content>
            <Heading>
                We recommend these resources for learning more about \\device//
            </Heading>
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                {links.map(({ label, href }) => (
                    <Button
                        key={label}
                        variant="secondary"
                        large
                        onClick={() => openUrl(href)}
                        className="tw-w-96 tw-border-primary tw-text-left tw-text-primary focus:tw-border-primary"
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
