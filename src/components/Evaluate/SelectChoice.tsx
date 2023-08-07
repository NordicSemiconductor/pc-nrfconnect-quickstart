/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { Button, classNames } from 'pc-nrfconnect-shared';

import { Choice, deviceEvaluationChoices } from '../../features/deviceGuides';
import Heading from '../Heading';
import Main from '../Main';

export default ({
    back,
    device,
    selectChoice,
}: {
    back: () => void;
    device: Device;
    selectChoice: (choice: Choice) => void;
}) => {
    const [selected, setSelected] = useState<Choice>();

    return (
        <Main device={device}>
            <Main.Content className="tw-gap-8">
                <Heading>Update and verify</Heading>
                <p>
                    This will program the latest modem firmware \\firmware// and
                    the app you select.
                </p>
                <div className="tw-flex tw-flex-row tw-gap-2">
                    {deviceEvaluationChoices(device).map(choice => (
                        <div
                            key={choice.name}
                            className={`tw-flex tw-w-44 tw-flex-col tw-gap-2 tw-border tw-border-solid tw-border-gray-500 tw-p-4 tw-text-left tw-text-xs ${
                                selected?.name === choice.name
                                    ? 'tw-bg-primary tw-text-white'
                                    : 'tw-bg-gray-50'
                            }`}
                        >
                            <p className="tw-font-bold">{choice.name}</p>
                            <p className="tw-flex-1">{choice.description}</p>
                            <Button
                                variant="secondary"
                                onClick={() => setSelected(choice)}
                                className={classNames(
                                    selected?.name === choice.name &&
                                        'tw-pointer-events-none tw-cursor-none tw-opacity-0',
                                    'tw-w-full'
                                )}
                            >
                                Select
                            </Button>
                        </div>
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
                    disabled={!selected}
                    onClick={() => {
                        if (!selected) return;

                        selectChoice(selected);
                    }}
                >
                    Program
                </Button>
            </Main.Footer>
        </Main>
    );
};