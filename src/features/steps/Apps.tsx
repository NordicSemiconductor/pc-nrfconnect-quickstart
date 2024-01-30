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
import { Next, Skip } from '../../common/Next';
import { getStepConfiguration } from '../device/deviceGuides';
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
                <div className="tw-w-80">{app.description}</div>
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
                            getStepConfiguration('apps', device).apps.includes(
                                app.name
                            )
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
        setRecommendedApps(oldRecommendedApps =>
            oldRecommendedApps.map(a => {
                if (a.name === app.id) {
                    a.selected = selected;
                }
                return a;
            })
        );

    const installApp = (appToBeInstalled: App) => {
        apps.installDownloadableApp(appToBeInstalled)
            .then(installedApp =>
                setRecommendedApps(oldRecommendedApps =>
                    oldRecommendedApps.map(app =>
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
    const anyInstalling = recommendedApps.some(app => app.installing);
    const allInstalled = recommendedApps.every(app => apps.isInstalled(app));

    return (
        <Main>
            <Main.Content
                heading="Select apps to install"
                subHeading={`Check out these nRF Connect for Desktop applications for ${
                    deviceInfo(device).name
                }:`}
            >
                <MultipleSelect
                    items={items}
                    onSelect={(item, selected) =>
                        setAppSelected(item, selected)
                    }
                />
            </Main.Content>
            <Main.Footer>
                <Back disabled={anyInstalling} />
                {allInstalled ? (
                    <Next />
                ) : (
                    <>
                        <Skip disabled={anyInstalling} />
                        <Next
                            label="Install"
                            variant="primary"
                            disabled={!anySelected || anyInstalling}
                            onClick={() =>
                                recommendedApps.forEach(app => {
                                    if (
                                        !apps.isInstalled(app) &&
                                        app.selected
                                    ) {
                                        setRecommendedApps(oldRecommendedApps =>
                                            oldRecommendedApps.map(a =>
                                                a === app
                                                    ? {
                                                          ...app,
                                                          installing: true,
                                                      }
                                                    : a
                                            )
                                        );
                                        usageData.sendUsageData(
                                            'Installing app',
                                            { app }
                                        );
                                        installApp(app);
                                    }
                                })
                            }
                        />
                    </>
                )}
            </Main.Footer>
        </Main>
    );
};
