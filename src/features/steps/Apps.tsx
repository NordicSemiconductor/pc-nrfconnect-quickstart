/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    DownloadableApp,
    Spinner,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { deviceApps } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

type App = DownloadableApp & {
    selected: boolean;
    installing: boolean;
};

const InstalledCheckBox = () => (
    <input
        type="checkbox"
        checked
        disabled
        onChange={() => {}}
        className="tw-h-4 tw-w-4 tw-appearance-none tw-rounded-sm tw-border-2 tw-border-solid tw-border-green tw-opacity-100 before:tw-absolute before:tw--top-[0.0625rem] before:tw-left-3 before:tw-h-2 before:tw-w-2 before:tw-bg-white after:tw-absolute after:tw--top-0 after:tw-left-[0.45rem] after:tw-h-[0.8rem] after:tw-w-[0.4rem] after:tw-rotate-45 after:tw-border-b-2 after:tw-border-l-0 after:tw-border-r-2 after:tw-border-t-0 after:tw-border-solid after:tw-border-green after:tw-content-['']"
    />
);

const AppCheckBox = ({
    id,
    checked,
    onClick,
}: {
    id: string;
    checked: boolean;
    onClick: (selected: boolean) => void;
}) => (
    <input
        type="checkbox"
        id={id}
        checked={checked}
        onClick={event => onClick(event.currentTarget.checked)}
        className="tw-h-4 tw-w-4 tw-cursor-pointer tw-appearance-none tw-rounded-sm tw-border-2 tw-border-solid tw-border-gray-500 before:tw-absolute before:tw--top-[0.0625rem] before:tw-left-3 before:tw-h-2 before:tw-w-2 before:tw-bg-white after:tw-absolute after:tw--top-0 after:tw-left-[0.45rem] after:tw-h-[0.8rem] after:tw-w-[0.4rem] after:tw-rotate-45 after:tw-border-b-2 after:tw-border-l-0 after:tw-border-r-2 after:tw-border-t-0 after:tw-border-solid after:tw-border-gray-500 after:tw-content-[''] [&:not(:checked:after)]:tw-hidden [&:not(:checked:before)]:tw-hidden"
    />
);

const selectableStyle = (app: App) =>
    apps.isInstalled(app) ? '' : 'tw-cursor-pointer';

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
            {!apps.isInstalled(app) && !app.installing && (
                <AppCheckBox
                    id={app.name}
                    checked={apps.isInstalled(app) || app.selected}
                    onClick={onClick}
                />
            )}
            {app.installing && <Spinner size="sm" />}
            {apps.isInstalled(app) && <InstalledCheckBox />}
        </div>
        <label htmlFor={app.name} className="tw-flex tw-flex-col tw-text-left">
            <p className={selectableStyle(app)}>
                <strong>{app.displayName}</strong>
            </p>
            <p className={selectableStyle(app)}>{app.description}</p>
        </label>
    </div>
);

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
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
                    .map(app => ({
                        ...app,
                        selected: false,
                        installing: false,
                    }))
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
                            ? {
                                  ...installedApp,
                                  selected: false,
                                  installing: false,
                              }
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
                {recommendedApps.some(app => !apps.isInstalled(app)) ? (
                    <p>You can always add and remove apps later.</p>
                ) : (
                    <p>All recommended apps are installed</p>
                )}
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
                <Back />
                <Next
                    label={anySelected ? 'Install' : 'Next'}
                    variant="primary"
                    onClick={next => {
                        if (!anySelected) {
                            next();
                        } else {
                            recommendedApps.forEach(app => {
                                if (!apps.isInstalled(app) && app.selected) {
                                    setRecommendedApps(
                                        recommendedApps.map(a =>
                                            a === app
                                                ? { ...app, installing: true }
                                                : a
                                        )
                                    );
                                    usageData.sendUsageData(
                                        `Installing app ${app}`
                                    );
                                    installApp(app);
                                }
                            });
                        }
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
