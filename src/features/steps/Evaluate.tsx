/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    Button,
    DownloadableApp,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import Main from '../../common/Main';
import { getChoiceUnsafely } from '../device/deviceSlice';

export default () => {
    const choice = useAppSelector(getChoiceUnsafely);
    const [downloadableApps, setDownloadableApps] = useState<DownloadableApp[]>(
        []
    );
    const getAppName = (app: string) =>
        downloadableApps.find(a => a.name === app)?.displayName || app;

    useEffect(() => {
        apps.getDownloadableApps().then(({ apps: receivedApps }) =>
            setDownloadableApps(receivedApps)
        );
    }, [choice.evaluationResources]);

    return (
        <Main>
            <Main.Content heading={`Evaluate ${choice.name}`}>
                {choice.evaluationResources.map(
                    ({ links, app, description }) => (
                        <div
                            key={app}
                            className="tw-flex tw-flex-row tw-justify-between"
                        >
                            <div className="tw-flex tw-flex-col">
                                <div>
                                    <b>{getAppName(app)}</b>
                                </div>
                                {description}
                                <br />
                                {links.map(({ label, href }) => (
                                    <div key={label} />
                                ))}
                            </div>
                            <Button
                                variant="link-button"
                                size="xl"
                                onClick={() => {}}
                            >
                                Open {getAppName(app)}
                            </Button>
                        </div>
                    )
                )}
            </Main.Content>
        </Main>
    );
};
