/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { IssueBox } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import Main from '../../../common/Main';
import Searching from '../../../common/Searching';
import { getConnectedDevices } from '../../device/deviceSlice';

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
                subHeading="Connect a Nordic development kit to your PC."
            >
                <>
                    <Searching />
                    {longSearchDuration && (
                        <div className="tw-pt-8">
                            <IssueBox
                                mdiIcon="mdi-clock-alert-outline"
                                color="tw-text-primary"
                                title="Detection is taking longer than expected. Ensure the kit is powered on."
                            />
                        </div>
                    )}
                </>
            </Main.Content>
            <Main.Footer />
        </Main>
    );
};
