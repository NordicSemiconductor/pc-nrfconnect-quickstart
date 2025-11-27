/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import path from 'path';

import { AppThunk, RootState } from '../../../../app/store';
import { getFirmwareFolder } from '../../../../features/device/deviceGuides';
import { DeviceWithSerialnumber } from '../../../../features/device/deviceLib';
import { ActionListEntry } from '../../../../features/device/deviceSlice';
import type { ProgrammingConfig } from '../programEffects';
import { setError, setProgrammingProgress } from '../programSlice';

export default (
        actionList: ActionListEntry[],
    ): AppThunk<RootState, ProgrammingConfig> =>
    dispatch => {
        const array: ProgrammingConfig['actions'] = [];

        const addActionEntry = (item: ProgrammingConfig['actions'][number]) =>
            array.push(item) - 1;

        const actions = actionList.map(action => {
            switch (action.type) {
                    const { file, core, link } = action.firmware;
                    const coreLabel = core ? `${core} core` : 'nRF5340';

                case 'program': {
                    const { file, core, link, coreLabel } = action.firmware;
                    const index = addActionEntry({
                        title: `${coreLabel || core} core`,
                        link,
                    });
                    return async (device: DeviceWithSerialnumber) => {
                        try {
                            await NrfutilDeviceLib.program(
                                device,
                                path.join(getFirmwareFolder(), file),
                                ({ totalProgressPercentage: progress }) =>
                                    dispatch(
                                        setProgrammingProgress({
                                            index,
                                            progress,
                                        }),
                                    ),
                                core,
                                undefined,
                            );
                        } catch (e) {
                            dispatch(
                                setError({
                                    icon: 'mdi-flash-alert-outline',
                                    text: `Failed to program the ${coreLabel || core} core`,
                                }),
                            );
                            throw e;
                        }
                    };
                }
                case 'wait':
                    return () =>
                        new Promise(resolve => {
                            setTimeout(resolve, action.durationMs);
                        });
                default:
                    return () => {};
            }
        });

        return {
            run: device =>
                actions.reduce(
                    (acc, next) =>
                        acc.then(async () => {
                            await next(device);
                        }),
                    Promise.resolve(),
                ),
            actions: array,
        };
    };
