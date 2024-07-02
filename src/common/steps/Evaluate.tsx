/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    DownloadableApp,
    openUrl,
    openWindow,
    Spinner,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
} from '../../features/device/deviceSlice';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';
import { ResourceWithButton } from '../Resource';

interface CommonResourceProps {
    description: string;
    supplementaryLinks?: { label: string; href: string }[];
}

interface ExternalLinkResource extends CommonResourceProps {
    title: string;
    mainLink: { label: string; href: string };
}

interface AppResource extends CommonResourceProps {
    app: string;
}

const isExternalLinkResource = (
    resource: AppResource | ExternalLinkResource
): resource is ExternalLinkResource => 'mainLink' in resource;

interface ResourcePage {
    ref: string;
    resources: (AppResource | ExternalLinkResource)[];
}

const EvaluateStep = ({ resourcePages }: { resourcePages: ResourcePage[] }) => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const choice = useAppSelector(getChoiceUnsafely);
    const [installingApps, setInstallingApps] = useState<DownloadableApp[]>([]);
    const [downloadableApps, setDownloadableApps] = useState<DownloadableApp[]>(
        []
    );

    const resources =
        resourcePages.find(resource => resource.ref === choice.name)
            ?.resources || [];

    const getAppName = (app: string) =>
        downloadableApps.find(a => a.name === app)?.displayName || app;

    useEffect(() => {
        apps.getDownloadableApps().then(({ apps: receivedApps }) =>
            setDownloadableApps(receivedApps)
        );
    }, []);

    return (
        <Main>
            <Main.Content heading={`Evaluate ${choice.name}`}>
                <div className="tw-flex tw-flex-col tw-gap-6">
                    {resources.map(resource => (
                        <ResourceWithButton
                            key={
                                isExternalLinkResource(resource)
                                    ? resource.title
                                    : resource.app
                            }
                            title={
                                isExternalLinkResource(resource)
                                    ? resource.title
                                    : getAppName(resource.app)
                            }
                            description={resource.description}
                            links={resource.supplementaryLinks}
                            disabled={
                                !isExternalLinkResource(resource) &&
                                !!installingApps.find(
                                    a => a.name === resource.app
                                )
                            }
                            onClick={async () => {
                                if (isExternalLinkResource(resource)) {
                                    telemetry.sendEvent(
                                        'Opened evaluation link',
                                        {
                                            link: resource.mainLink.href,
                                        }
                                    );
                                    openUrl(resource.mainLink.href);
                                } else {
                                    const app = await apps
                                        .getDownloadableApps()
                                        .then(({ apps: receivedApps }) =>
                                            receivedApps.find(
                                                a =>
                                                    a.name === resource.app &&
                                                    a.source === 'official'
                                            )
                                        );

                                    telemetry.sendEvent(
                                        'Opened evaluation app',
                                        {
                                            app: resource.app,
                                        }
                                    );

                                    if (app && !apps.isInstalled(app)) {
                                        setInstallingApps([
                                            ...installingApps,
                                            app,
                                        ]);
                                        await apps.installDownloadableApp(app);
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
                            buttonLabel={
                                isExternalLinkResource(resource)
                                    ? resource.mainLink.label
                                    : `${
                                          installingApps.find(
                                              a => a.name === resource.app
                                          )
                                              ? 'Installing...'
                                              : `Open ${getAppName(
                                                    resource.app
                                                )}`
                                      }`
                            }
                        />
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

export default (resourcePages: ResourcePage[]) => ({
    name: 'Evaluate',
    component: () => EvaluateStep({ resourcePages }),
});
