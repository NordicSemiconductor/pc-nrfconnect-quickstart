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
    openUrl,
    openWindow,
    Spinner,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Link from '../../common/Link';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import {
    EvaluationResource,
    ExternalLinkEvaluationResource,
} from '../device/deviceGuides';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
} from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const choice = useAppSelector(getChoiceUnsafely);
    const [installingApps, setInstallingApps] = useState<DownloadableApp[]>([]);
    const [downloadableApps, setDownloadableApps] = useState<DownloadableApp[]>(
        []
    );

    const isExternalLinkResource = (
        resource: EvaluationResource
    ): resource is ExternalLinkEvaluationResource => 'link' in resource;

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
                    {choice.evaluationResources.map(resource => (
                        <div
                            key={
                                isExternalLinkResource(resource)
                                    ? resource.title
                                    : resource.app
                            }
                            className="tw-flex tw-flex-row tw-justify-between tw-gap-12"
                        >
                            <div className="tw-w-80">
                                <div>
                                    <b>
                                        {isExternalLinkResource(resource)
                                            ? resource.title
                                            : getAppName(resource.app)}
                                    </b>
                                </div>
                                {resource.description}
                                {resource.links?.map(({ label, href }) => (
                                    <div
                                        key={label}
                                        className="tw-pt-0.5 tw-text-xs"
                                    >
                                        <Link
                                            label={label}
                                            href={href}
                                            color="tw-text-primary"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="link-button"
                                size="xl"
                                disabled={
                                    !isExternalLinkResource(resource) &&
                                    !!installingApps.find(
                                        a => a.name === resource.app
                                    )
                                }
                                onClick={async () => {
                                    if (isExternalLinkResource(resource)) {
                                        usageData.sendUsageData(
                                            `Opened link ${resource.link.href}`
                                        );
                                        openUrl(resource.link.href);
                                    } else {
                                        const app = downloadableApps.find(
                                            a =>
                                                a.name === resource.app &&
                                                a.source === 'official'
                                        );

                                        usageData.sendUsageData(
                                            `Opened app ${resource.app}`
                                        );
                                        if (app && !apps.isInstalled(app)) {
                                            setInstallingApps([
                                                ...installingApps,
                                                app,
                                            ]);
                                            await apps.installDownloadableApp(
                                                app
                                            );
                                            setInstallingApps(
                                                installingApps.filter(
                                                    a => a.name !== app.name
                                                )
                                            );
                                        }

                                        openWindow.openApp(
                                            {
                                                name: resource.app,
                                                source: 'official',
                                            },
                                            {
                                                device: {
                                                    serialNumber:
                                                        device.serialNumber,
                                                },
                                            }
                                        );
                                    }
                                }}
                                className="tw-flex-1"
                            >
                                {isExternalLinkResource(resource)
                                    ? resource.link.label
                                    : `${
                                          installingApps.find(
                                              a => a.name === resource.app
                                          )
                                              ? 'Installing...'
                                              : `Open ${getAppName(
                                                    resource.app
                                                )}`
                                      }`}
                            </Button>
                        </div>
                    ))}
                </div>
            </Main.Content>
            <Main.Footer>
                {installingApps.length > 0 && (
                    <div className="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-text-primary">
                        <Spinner size="lg" />
                    </div>
                )}
                <Back disabled={installingApps.length > 0} />
                <Next disabled={installingApps.length > 0} />
            </Main.Footer>
        </Main>
    );
};
