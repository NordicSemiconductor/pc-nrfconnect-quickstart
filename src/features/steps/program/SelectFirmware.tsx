/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    deviceInfo,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { selectFirmwareWithoutProgrammingOption } from '../../../app/devOptions';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Link from '../../../common/Link';
import { RadioSelect } from '../../../common/listSelect/RadioSelect';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import { Choice, getStepConfiguration } from '../../device/deviceGuides';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    setChoice,
} from '../../device/deviceSlice';
import { startProgramming } from './programEffects';
import { setFirmwareNote } from './programSlice';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const previouslySelectedChoice = useAppSelector(getChoiceUnsafely);

    const [selected, setSelected] = React.useState<Choice | undefined>(
        previouslySelectedChoice
    );

    const items = getStepConfiguration('program', device).choices.map(
        choice => {
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
                            <div className="tw-text-sm">
                                {choice.description}
                            </div>
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
        }
    );

    return (
        <Main>
            <Main.Content heading="Select an application to program">
                <RadioSelect
                    items={items}
                    onSelect={item =>
                        setSelected(
                            getStepConfiguration(
                                'program',
                                device
                            ).choices.find(choice => choice.name === item.id)
                        )
                    }
                />
            </Main.Content>
            <Main.Footer>
                <Back />
                {!!previouslySelectedChoice && <Skip />}
                {selectFirmwareWithoutProgrammingOption && (
                    <Next
                        label="Select (Don't program)"
                        disabled={!selected}
                        onClick={next => {
                            if (!selected) return;

                            dispatch(setChoice(selected));
                            next();
                        }}
                    />
                )}
                <Next
                    label="Program"
                    disabled={!selected}
                    onClick={() => {
                        if (!selected) return;

                        telemetry.sendEvent('Select firmware', {
                            fwName: selected.name,
                            deviceName:
                                deviceInfo(device).name ?? 'Unknown device',
                        });

                        dispatch(setChoice(selected));
                        if (selected.firmwareNote)
                            dispatch(setFirmwareNote(selected.firmwareNote));
                        dispatch(startProgramming());
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
