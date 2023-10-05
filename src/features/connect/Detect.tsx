/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../app/store';
import { DevZoneLink } from '../../common/Link';
import Main from '../../common/Main';
import Searching from '../../common/Searching';
import { getConnectedDevices } from '../device/deviceSlice';

export default () => {
    const connectedDevices = useAppSelector(getConnectedDevices);

    const [longSearchDuration, setLongSearchDuration] = useState(false);

    useEffect(() => {
        if (connectedDevices.length) {
            return;
        }

        const timeout = setTimeout(() => {
            setLongSearchDuration(true);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [connectedDevices]);

    return (
        <Main>
            <Main.Content
                heading="Detect"
                subHeading="Connect a Nordic kit to your PC."
            >
                <>
                    <Searching />
                    {longSearchDuration && (
                        <div>
                            <br />
                            <br />
                            <br />
                            <p>Kit detection is taking longer than expected.</p>
                            <br />
                            <p>
                                Contact support on <DevZoneLink /> if problem
                                persists.
                            </p>
                        </div>
                    )}
                </>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
