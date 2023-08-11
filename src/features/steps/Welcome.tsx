/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import { openWindow } from 'pc-nrfconnect-shared';

import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';

export default () => {
    const quit = () => {
        openWindow.openLauncher();
        getCurrentWindow().close();
    };

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
                <Back label="Quit Quickstart" onClick={quit} />
                <Next />
            </Main.Footer>
        </Main>
    );
};
