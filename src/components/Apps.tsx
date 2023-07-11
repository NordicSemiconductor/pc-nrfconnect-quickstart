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
}

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [apps, setApps] = useState<App[]>([]);
    useEffect(() => {
        ipcRenderer
            .invoke('apps:get-downloadable-apps')
            .then(({ apps: a }: { apps: App[] }) => {
                setApps(
                    a.filter(
                        app =>
                            app.source === 'official' &&
                            deviceApps(testDevice).includes(app.name)
                    )
                );
            });
    }, []);

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content className="tw-gap-6">
                <Heading>Install recommended apps</Heading>
                <p>You can always add and remove apps later.</p>
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-3">
                    {apps.map(app => (
                        <div
                            key={app.displayName}
                            className="tw-flex tw-flex-row tw-gap-4"
                        >
                            <input
                                type="checkbox"
                                checked={!!app.installed}
                                className=""
                            />
                            <div className="tw-flex tw-flex-col tw-text-left">
                                <p className="tw-font-bold">
                                    {app.displayName}
                                </p>
                                <p>{app.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Main.Content>
            <Main.Footer>
                <Button variant="secondary" large onClick={back}>
                    Back
                </Button>
                {/* Replace/change the below button to be a Next button when no isntallable apps are selected? */}
                <Button
                    variant="primary"
                    large
                    onClick={() => {
                        // TODO: Install selected apps

                        next();
                    }}
                >
                    Install
                </Button>
            </Main.Footer>
        </Main>
    );
};
