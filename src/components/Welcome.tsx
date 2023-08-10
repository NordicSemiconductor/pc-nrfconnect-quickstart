/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import { Button, openWindow } from 'pc-nrfconnect-shared';

import { useAppDispatch } from '../app/store';
import { goToNextStep } from '../features/steps/stepsSlice';
import Main from './Main';

export default () => {
    const dispatch = useAppDispatch();

    const quit = () => {
        openWindow.openLauncher();
        getCurrentWindow().close();
    };

    const next = () => dispatch(goToNextStep());

    return (
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
};
