/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'pc-nrfconnect-shared';

import { getSelectedChoice } from '../features/choiceSlice';
import { getSelectedDevice } from '../features/deviceSlice';
import Heading from './Heading';
import Main from './Main';

export default ({
    back,
    quit,
    openLauncher,
    openApp,
}: {
    back: () => void;
    quit: () => void;
    openLauncher: () => void;
    openApp: (app: string, serialNumber?: string) => void;
}) => {
    const selectedDevice = useSelector(getSelectedDevice);
    const selectedChoice = useSelector(getSelectedChoice);

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content className="tw-max-w-sm">
                <Heading>Finished Quickstart</Heading>
                <div className="tw-flex tw-flex-col tw-gap-4 tw-pt-10">
                    <p>You now have finished all the steps</p>
                    <p>
                        Quickstart can be opened at any time from nRF Connect
                        for Desktop
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
                <Button
                    variant="primary"
                    large
                    onClick={() => {
                        openLauncher();
                        if (selectedChoice?.app) {
                            openApp(
                                selectedChoice.app,
                                selectedDevice?.serialNumber
                            );
                        }
                        quit();
                    }}
                >
                    Exit and open nRF Connect for Desktop
                </Button>
            </Main.Footer>
        </Main>
    );
};
