/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../../app/store';
import Main from '../../../common/Main';
import { getConnectedDevices } from '../../device/deviceSlice';
import Searching from './Searching';

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
                            <p>This is taking longer than expected.</p>
                            <br />
                            <p>
                                Context support on
                                <b>
                                    {' '}
                                    <u>DevZone</u>{' '}
                                </b>
                                if problem persists.
                            </p>
                            <br />
                            <p>
                                Don&apos;t have a development kit? Do a
                                <b>
                                    {' '}
                                    <u>paper evaluation</u>{' '}
                                </b>
                                .
                            </p>
                        </div>
                    )}
                </>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
