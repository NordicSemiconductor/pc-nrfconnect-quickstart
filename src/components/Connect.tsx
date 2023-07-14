/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import DeviceLogo from './DeviceLogo';
import Heading from './Heading';
import Main from './Main';

const invokeIfSpaceOrEnterPressed =
    (onClick: React.KeyboardEventHandler<Element>) =>
        (event: React.KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === ' ' || event.key === 'Enter') {
                onClick(event);
            }
        };

export default ({ next }: { next: () => void }) => {
    const [devices, setDevices] = useState<{ name: string; kit: string }[]>([
        { name: 'Testing', kit: 'nRF9161 DK' },
        { name: 'Testing2', kit: 'nRF9161 DK' },
        { name: 'Testing3', kit: 'nRF9161 DK' },
        { name: 'Testing4', kit: 'nRF9161 DK' },
        { name: 'Testing5', kit: 'nRF9161 DK' },
        { name: 'Testing6', kit: 'nRF9161 DK' },
    ]);
    const [timeout, setTimeout] = useState(true);

    const onClick = () => {
        // TODO: select device

        next();
    };

    return (
        <Main>
            <Main.Header />
            <Main.Content>
                <Heading>
                    {devices.length
                        ? 'Select your kit'
                        : 'Connect a Nordic kit to your PC'}
                </Heading>
                <div className="tw-p-8">
                    <div className="scrollbar tw-max-h-40 tw-w-48 tw-bg-gray-50">
                        {devices.map(d => (
                            <div
                                key={d.name}
                                tabIndex={0}
                                role="button"
                                onKeyUp={invokeIfSpaceOrEnterPressed(onClick)}
                                onClick={onClick}
                                className="tw-flex tw-w-full tw-cursor-pointer tw-flex-row tw-items-center tw-gap-1 tw-border-b tw-border-solid tw-px-2 tw-py-1 last:tw-border-b-0 hover:tw-bg-white"
                            >
                                <DeviceLogo
                                    device={d.kit}
                                    className="tw-h-5 tw-w-6 tw-fill-gray-700"
                                />
                                <div className="tw-flex tw-flex-col tw-text-left">
                                    <p>
                                        <b>{d.kit}</b>
                                    </p>
                                    <p>{d.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-gap-4">
                    <p>Searching icon/spinner</p>
                    <p>Searching for devices</p>
                    {timeout && (
                        <div>
                            <p>This is taking a while.</p>
                            <p>
                                {' '}
                                If this persists, contact support on{' '}
                                <b>
                                    <u>DevZone</u>
                                </b>
                            </p>
                        </div>
                    )}
                </div>
            </Main.Content>
        </Main>
    );
};
