/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button } from 'pc-nrfconnect-shared';

import { deviceApps } from './devices';
import Heading from './Heading';
import Main from './Main';

const testDevice = 'nRF9161 DK';

interface App {
    displayName: string;
    description: string;
    name: string;
    source: string;
    installed: object;
    selected: boolean;
}

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
            {!app.installed && (
                <input
                    type="checkbox"
                    id={app.name}
                    disabled={!!app.installed}
                    onClick={event =>
                        onClick(
                            (
                                event as unknown as React.ChangeEvent<HTMLInputElement>
                            ).target.checked
                        )
                    }
                    className="tw-h-4 tw-w-4 tw-cursor-pointer tw-appearance-none tw-rounded-sm tw-border-2 tw-border-solid tw-border-gray-500 before:tw-absolute before:tw--top-[0.0625rem] before:tw-left-3 before:tw-h-2 before:tw-w-2 before:tw-bg-white after:tw-absolute after:tw--top-[0.0675rem] after:tw-left-[0.45rem] after:tw-h-[0.8rem] after:tw-w-[0.4rem] after:tw-rotate-45 after:tw-border-b-2 after:tw-border-l-0 after:tw-border-r-2 after:tw-border-t-0 after:tw-border-solid after:tw-border-gray-500 after:tw-content-[''] [&:not(:checked:after)]:tw-hidden [&:not(:checked:before)]:tw-hidden"
                />
            )}
            {app.installed && <> : ) </>}
        </div>
        <label htmlFor={app.name} className="tw-flex tw-flex-col tw-text-left">
            <p className="tw-cursor-pointer tw-font-bold">{app.displayName}</p>
            <p className="tw-cursor-pointer">{app.description}</p>
        </label>
    </div>
);

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [recommendedApps, setRecommendedApps] = useState<App[]>([]);

    useEffect(() => {
        ipcRenderer
            .invoke('apps:get-downloadable-apps')
            .then(({ apps }: { apps: App[] }) => {
                setRecommendedApps(
                    apps.filter(
                        app =>
                            app.source === 'official' &&
                            deviceApps(testDevice).includes(app.name)
                    )
                );
            });
    }, []);

    const setAppSelected = (app: App, selected: boolean) =>
        setRecommendedApps(
            recommendedApps.map(a => {
                if (a === app) {
                    a.selected = selected;
                }
                return a;
            })
        );

    const installApp = (appToBeInstalled: App) => {
        ipcRenderer
            .invoke('apps:install-downloadable-app', appToBeInstalled)
            .then(installedApp =>
                setRecommendedApps(
                    recommendedApps.map(app => {
                        if (app.name === installedApp.name) {
                            return installedApp;
                        }
                        return app;
                    })
                )
            )
            .catch(e => console.error(e));
    };

    return (
        <Main>
            <Main.Header showDevice />
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
                        recommendedApps.forEach(app => {
                            if (!app.installed && app.selected) {
                                installApp(app);
                            }
                        });

                        if (!recommendedApps.some(app => app.selected)) {
                            next();
                        }
                    }}
                >
                    {recommendedApps.some(app => app.selected)
                        ? 'Install'
                        : 'Next'}
                </Button>
            </Main.Footer>
        </Main>
    );
};
