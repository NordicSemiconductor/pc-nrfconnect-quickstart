/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    classNames,
    deviceInfo,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Choice, deviceEvaluationChoices } from '../../device/deviceGuides';
import { getSelectedDeviceUnsafely, setChoice } from '../../device/deviceSlice';
import { startProgramming } from './programEffects';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);

    const [selected, setSelected] = React.useState<Choice>();

    return (
        <Main>
            <Main.Content heading="Select application" className="tw-gap-8">
                <p>
                    This will program the application and the latest modem
                    firmware
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
                            {choice.documentation && (
                                <a
                                    href={choice.documentation.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tw-text-nordicBlue"
                                >
                                    {choice.documentation.label}
                                </a>
                            )}
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
                <Button
                    variant="primary"
                    size="xl"
                    disabled={!selected}
                    onClick={() => {
                        if (!selected) return;

                        usageData.sendUsageData(
                            `Select firmware ${selected.name}`,
                            deviceInfo(device).name ?? 'Unknown device'
                        );

                        dispatch(setChoice(selected));
                        dispatch(startProgramming());
                    }}
                >
                    Program
                </Button>
            </Main.Footer>
        </Main>
    );
};
