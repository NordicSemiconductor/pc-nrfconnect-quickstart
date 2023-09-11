/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    deviceInfo,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Link from '../../../common/Link';
import { RadioSelect } from '../../../common/listSelect/RadioSelect';
import Main from '../../../common/Main';
import { Skip } from '../../../common/Next';
import { Choice, deviceChoices } from '../../device/deviceGuides';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    setChoice,
} from '../../device/deviceSlice';
import { startProgramming } from './programEffects';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);

    const [selected, setSelected] = React.useState<Choice | undefined>(
        previouslySelectedChoice
    );

    const items = deviceChoices(device).map(choice => {
        const isSelected = selected?.name === choice.name;
        return {
            id: choice.name,
            selected: isSelected,
            content: (
                <div className="tw-flex tw-flex-row tw-items-start tw-justify-start">
                    <div className="tw-w-32 tw-flex-shrink-0 tw-pr-5">
                        <b>{choice.name}</b>
                    </div>
                    <div className="tw-flex tw-flex-col tw-justify-start">
                        <div className="tw-text-sm">{choice.description}</div>
                        {choice.documentation && (
                            <div className="tw-pt-px tw-text-xs">
                                <Link
                                    label={choice.documentation.label}
                                    href={choice.documentation.href}
                                    color={
                                        isSelected
                                            ? 'hover:tw-text-gray-50'
                                            : 'hover:tw-text-gray-700'
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            ),
        };
    });

    return (
        <Main>
            <Main.Content heading="Select an application to program">
                <RadioSelect
                    items={items}
                    onSelect={item =>
                        setSelected(
                            deviceChoices(device).find(
                                choice => choice.name === item.id
                            )
                        )
                    }
                />
            </Main.Content>
            <Main.Footer>
                <Back />
                {!!previouslySelectedChoice && <Skip />}
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
