/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { apps, Button, DownloadableApp } from 'pc-nrfconnect-shared';

import { deviceApps } from '../features/deviceGuides';
import Heading from './Heading';
import Main from './Main';

type App = DownloadableApp & {
    selected: boolean;
};

const canBeInstalled = (app: DownloadableApp) =>
    !apps.isInstalled(app) || apps.isUpdatable(app);

const AppItem = ({
    app,
    onClick,
}: {
    app: App;
    onClick: (selected: boolean) => void;
}) => (
    <div
        key={app.displayName}
        className="tw-relative tw-flex tw-flex-row tw-gap-4"
    >
        <div className="tw-pt-0.5">
            {canBeInstalled(app) && (
                <input
                    type="checkbox"
                    id={app.name}
                    disabled={!canBeInstalled(app)}
                    onClick={event => onClick(event.currentTarget.checked)}
                    className="tw-h-4 tw-w-4 tw-cursor-pointer tw-appearance-none tw-rounded-sm tw-border-2 tw-border-solid tw-border-gray-500 before:tw-absolute before:tw--top-[0.0625rem] before:tw-left-3 before:tw-h-2 before:tw-w-2 before:tw-bg-white after:tw-absolute after:tw--top-0 after:tw-left-[0.45rem] after:tw-h-[0.8rem] after:tw-w-[0.4rem] after:tw-rotate-45 after:tw-border-b-2 after:tw-border-l-0 after:tw-border-r-2 after:tw-border-t-0 after:tw-border-solid after:tw-border-gray-500 after:tw-content-[''] [&:not(:checked:after)]:tw-hidden [&:not(:checked:before)]:tw-hidden"
                />
            )}
            {!canBeInstalled(app) && <>: ) </>}
        </div>
        <label htmlFor={app.name} className="tw-flex tw-flex-col tw-text-left">
            <p className="tw-cursor-pointer tw-font-bold">
                {app.displayName} {apps.isUpdatable(app) && 'UPDATE'}
            </p>
            <p className="tw-cursor-pointer">{app.description}</p>
        </label>
    </div>
);

export default ({
    back,
    next,
    device,
}: {
    back: () => void;
    next: () => void;
    device: Device;
}) => {
    const [recommendedApps, setRecommendedApps] = useState<App[]>([]);

    useEffect(() => {
        apps.getDownloadableApps().then(({ apps: downloadableApps }) => {
            setRecommendedApps(
                downloadableApps
                    .filter(
                        app =>
                            app.source === 'official' &&
                            deviceApps(device).includes(app.name)
                    )
                    .map(app => ({ ...app, selected: false }))
            );
        });
    }, [device]);

    const setAppSelected = (app: App, selected: boolean) =>
        setRecommendedApps(
            recommendedApps.map(a => {
                if (a.name === app.name) {
                    a.selected = selected;
                }
                return a;
            })
        );

    const installApp = (appToBeInstalled: App) => {
        apps.installDownloadableApp(appToBeInstalled)
            .then(installedApp =>
                setRecommendedApps(
                    recommendedApps.map(app =>
                        app.name === installedApp.name
                            ? { ...app, selected: false }
                            : app
                    )
                )
            )
            .catch(e => console.error(e));
    };

    const anySelected = recommendedApps.some(app => app.selected);

    return (
        <Main device={device}>
            <Main.Content className="tw-gap-6">
                <Heading>Install recommended apps</Heading>
                <p>You can always add and remove apps later.</p>
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1">
                    {recommendedApps.map(app => (
                        <AppItem
                            key={app.name}
                            app={app}
                            onClick={selected => setAppSelected(app, selected)}
                        />
                    ))}
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
                        if (!anySelected) {
                            next();
                        } else {
                            recommendedApps.forEach(app => {
                                if (
                                    (!apps.isInstalled(app) ||
                                        apps.isUpdatable(app)) &&
                                    app.selected
                                ) {
                                    installApp(app);
                                }
                            });
                        }
                    }}
                >
                    {anySelected ? 'Install' : 'Next'}
                </Button>
            </Main.Footer>
        </Main>
    );
};
