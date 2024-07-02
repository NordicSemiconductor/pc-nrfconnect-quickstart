/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Spinner } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../../app/store';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next } from '../../Next';
import { InfoBox } from '../../NoticeBox';
import { getFirmwareNote } from './programSlice';
import ProgressIndicators from './ProgressIndicators';

export default () => {
    const note = useAppSelector(getFirmwareNote);

    return (
        <Main>
            <Main.Content heading="Programming">
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
                <div className="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-text-primary">
                    <Spinner size="lg" />
                </div>
                <Back disabled />
                <Next disabled />
            </Main.Footer>
        </Main>
    );
};
