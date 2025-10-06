/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import path from 'path';

import { AppThunk, RootState } from '../../../../app/store';
import { getFirmwareFolder } from '../../../../features/device/deviceGuides';
import { Choice } from '../../../../features/device/deviceSlice';
import type { ActionVariant } from '../programEffects';
import { setError, setProgrammingProgress } from '../programSlice';

export default (choice: Choice): AppThunk<RootState, ActionVariant> =>
    dispatch => ({
        run: device =>
            new Promise<void>((resolve, reject) => {
                choice.firmware.forEach(async ({ file, core }) => {
                    await NrfutilDeviceLib.program(
                        device,
                        path.join(getFirmwareFolder(), file),
                        ({ totalProgressPercentage: progress }) =>
                            dispatch(
                                setProgrammingProgress({
                                    index: 0,
                                    progress,
                                })
                            ),
                        core,
                        undefined
                    ).catch(() => {
                        dispatch(
                            setError({
                                icon: 'mdi-flash-alert-outline',
                                text: `Failed to program the ${
                                    core ? `${core} core` : 'Connectiity bridge'
                                }`,
                            })
                        );
                        reject();
                    });
                    // {
                    //         onTaskEnd: end => {
                    //             if (end.error) {
                    //                 // Thingy91X gets an onProgress event 100% when it fails which breaks expectations here. It will be changed/fixed in nrfutil
                    //                 dispatch(
                    //                     setProgrammingProgress({
                    //                         index: 0,
                    //                         progress: 0,
                    //                     })
                    //                 );
                    //                 dispatch(
                    //                     setError({
                    //                         icon: 'mdi-flash-alert-outline',
                    //                         text: `Failed to program the ${core} core`,
                    //                     })
                    //                 );
                    //             }
                    //         },
                    //     }
                    // });
                });
            }),
        operations: [
            ...choice.firmware.map(f => ({
                title: f.core ? `${f.core} core` : 'Connectivity bridge',
                link: f.link,
            })),
        ],
    });
