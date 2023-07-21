/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { Button, classNames } from 'pc-nrfconnect-shared';

import { deviceEvaluationChoices } from '../features/devices';
import Heading from './Heading';
import Main from './Main';

const testDevice = 'nRF9161 DK';
export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [selected, setSelected] = useState('');

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content className="tw-gap-8">
                <Heading>Update and verify</Heading>
                <p>
                    This will program the latest modem firmware \\firmware// and
                    the app you select.
                </p>
                <div className="tw-flex tw-flex-row tw-gap-2">
                    {deviceEvaluationChoices(testDevice).map(choice => (
                        <div
                            key={choice.name}
                            className={`tw-flex tw-w-44 tw-flex-col tw-gap-2 tw-border tw-border-solid tw-border-gray-500 tw-p-4 tw-text-left tw-text-xs ${
                                selected === choice.name
                                    ? 'tw-bg-primary tw-text-white'
                                    : 'tw-bg-gray-50'
                            }`}
                        >
                            <p className="tw-font-bold">{choice.name}</p>
                            <p className="tw-flex-1">{choice.description}</p>
                            <Button
                                variant="secondary"
                                onClick={() => setSelected(choice.name)}
                                className={classNames(
                                    selected === choice.name &&
                                        'tw-pointer-events-none tw-cursor-none tw-opacity-0'
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
                        // TODO: move to programming stage (either new step or state in this step?)

                        next();
                    }}
                >
                    Program
                </Button>
            </Main.Footer>
        </Main>
    );
};
