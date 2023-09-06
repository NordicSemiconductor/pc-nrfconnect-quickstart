/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    deviceInfo,
    DownloadableApp,
    Spinner,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import { SelectableListItem } from '../../common/listSelect/ListSelectItem';
import MultipleSelect from '../../common/listSelect/MultipleSelect';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { deviceApps } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

type App = DownloadableApp & {
    selected: boolean;
    installing: boolean;
};

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [recommendedApps, setRecommendedApps] = useState<App[]>([]);

    const items = recommendedApps.map(app => ({
        id: app.name,
        selected: app.selected,
        disabled: apps.isInstalled(app) || app.installing,
        disabledSelector: apps.isInstalled(app) ? (
            <p className="tw-text-sm">INSTALLED</p>
        ) : (
            <Spinner size="sm" />
        ),
        content: (
            <div className="tw-flex tw-flex-row tw-items-start tw-justify-start">
                <div className="tw-w-32 tw-flex-shrink-0 tw-pr-5">
                    <b>{app.displayName}</b>
                </div>
                <div>{app.description}</div>
            </div>
        ),
    }));

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

    const setAppSelected = (app: SelectableListItem, selected: boolean) =>
        setRecommendedApps(
            recommendedApps.map(a => {
                if (a.name === app.id) {
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
        <Main>
            <Main.Content
                heading="Select apps to install"
                subHeading={`We recommend these nRF Connect for Desktop applications for ${
                    deviceInfo(device).name
                }`}
            >
                <MultipleSelect
                    items={items}
                    onSelect={(item, selected) =>
                        setAppSelected(item, selected)
                    }
                />
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
