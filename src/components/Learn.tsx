/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button, openUrl } from 'pc-nrfconnect-shared';

import { deviceLinks } from '../features/devicesGuides';
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
                <Heading>
                    We recommend these resources for learning more about
                    \\device//
                </Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                    {deviceLinks(device).map(({ label, href }) => (
                        // I cannot use shared Buttons here because of the &:focus:not[disabled] styles on the secondary variant.
                        // Tailwind classes seem to not be able to overwrite it (they have less weight) and have not decided on whether this should be another variant yet.
                        <button
                            type="button"
                            key={label}
                            onClick={() => openUrl(href)}
                            className="tw-h-8 tw-w-96 tw-border tw-border-solid tw-border-primary tw-px-4 tw-text-left tw-text-sm tw-text-primary active:tw-bg-gray-50"
                        >
                            {label}
                        </button>
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
};
