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
import Heading from '../../../common/Heading';
import Main from '../../../common/Main';
import { getSelectedDeviceUnsafely, setChoice } from '../../device/deviceSlice';
import { startProgramming } from './programEffects';
import { getProgrammingError } from './programSlice';

export default () => {
    const dispatch = useAppDispatch();
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const error = useAppSelector(getProgrammingError);

    return (
        <Main device={device}>
            <Main.Content>
                <Heading>Failed to program device</Heading>
                <div className="tw-max-w-sm tw-pt-10">
                    <p>{describeError(error)}</p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={back => {
                        dispatch(setChoice(undefined));
                        back();
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
