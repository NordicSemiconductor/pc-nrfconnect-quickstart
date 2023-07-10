/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from 'pc-nrfconnect-shared';

import { deviceApps } from './devices';
import Heading from './Heading';
import Main from './Main';

const testDevice = 'nRF9161 DK';
const testAppContent = {
    cellularmonitor: {
        installed: true,
        title: 'Cellular Monitor',
        description: 'Complete view of device and system state',
    },
    'serial-terminal': {
        installed: true,
        title: 'Serial Terminal',
        description: 'Terminal for use with nRF devices',
    },
    programmer: {
        installed: true,
        title: 'Programmer',
        description: 'Erase and flash nRF SoCs',
    },
    IdentityProvisioning: {
        installed: false,
        title: 'Identity and provisioning',
        description: 'Write IMEI and claim devices',
    },
};
export default ({ back, next }: { back: () => void; next: () => void }) => (
    <Main>
        <Main.Header showDevice />
        <Main.Content className="tw-gap-6">
            <Heading>Install recommended apps</Heading>
            <p>You can always add and remove apps later.</p>
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-3">
                {deviceApps(testDevice).map(app => (
                    <div key={app} className="tw-flex tw-flex-row tw-gap-4">
                        <input type="checkbox" className="" />
                        <div className="tw-flex tw-flex-col tw-text-left">
                            <p className="tw-font-bold">
                                {/* @ts-expect-error Will fix types once I get apps from ipc calls */}
                                {testAppContent[app]?.title}
                            </p>
                            {/* @ts-expect-error Will fix types once I get apps from ipc calls */}
                            <p>{testAppContent[app]?.description}</p>
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
