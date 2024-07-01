/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next } from '../../Next';
import { InfoBox } from '../../NoticeBox';
import {
    getFirmwareNote,
    ProgrammingState,
    setProgrammingState,
} from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const dispatch = useAppDispatch();
    const note = useAppSelector(getFirmwareNote);

    return (
        <Main>
            <Main.Content heading="Programming successful">
                <ProgressIndicators />
                {note && (
                    <div className="tw-pt-8">
                        <InfoBox
                            mdiIcon="mdi-information-outline"
                            color="tw-text-primary"
                            title={note.title}
                            content={note.content}
                        />
                    </div>
                )}
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(
                            setProgrammingState(
                                ProgrammingState.SELECT_FIRMWARE
                            )
                        );
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
