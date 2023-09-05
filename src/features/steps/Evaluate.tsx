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
    ExternalLink,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
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
                <div className="tw-flex tw-flex-col tw-gap-6">
                    {choice.evaluationResources.map(
                        ({ links, app, description }) => (
                            <div
                                key={app}
                                className="tw-flex tw-flex-row tw-justify-between"
                            >
                                <div className="tw-w-80">
                                    <div>
                                        <b>{getAppName(app)}</b>
                                    </div>
                                    {description}
                                    {links.map(({ label, href }) => (
                                        <div
                                            key={label}
                                            className="tw-pt-0.5 tw-text-xs"
                                        >
                                            <ExternalLink
                                                label={label}
                                                href={href}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="link-button"
                                    size="xl"
                                    onClick={() => {
                                        usageData.sendUsageData(
                                            `Opened app ${app}`
                                        );
                                        // install and open or something
                                    }}
                                >
                                    Open {getAppName(app)}
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
