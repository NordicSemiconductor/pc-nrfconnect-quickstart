/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button, classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { Choice, deviceEvaluationChoices } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely, setChoice } from '../device/deviceSlice';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);

    const [selected, setSelected] = React.useState<Choice>();

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
                <Back />
                <Next
                    label="Program"
                    disabled={!selected}
                    onClick={next => {
                        if (!selected) return;

                        dispatch(setChoice(selected));
                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
