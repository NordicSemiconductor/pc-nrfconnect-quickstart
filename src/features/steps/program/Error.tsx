/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { getCurrentWindow } from '@electron/remote';
import {
    Button,
    describeError,
    openWindow,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { setChoice } from '../../device/deviceSlice';
import { startProgramming } from './programEffects';
import {
    getProgrammingError,
    ProgrammingState,
    setProgrammingState,
} from './programSlice';

export default () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(getProgrammingError);

    return (
        <Main>
            <Main.Content heading="Failed to program a device">
                <div className="tw-max-w-sm tw-pt-10">
                    <p>{describeError(error)}</p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setChoice(undefined));
                        dispatch(
                            setProgrammingState(
                                ProgrammingState.SELECT_FIRMWARE
                            )
                        );
                    }}
                />
                <Button
                    variant="primary"
                    large
                    onClick={() => dispatch(startProgramming())}
                >
                    Retry
                </Button>
                <Button
                    variant="secondary"
                    large
                    onClick={() => {
                        openWindow.openLauncher();
                        getCurrentWindow().close();
                    }}
                >
                    Quit
                </Button>
            </Main.Footer>
        </Main>
    );
};
