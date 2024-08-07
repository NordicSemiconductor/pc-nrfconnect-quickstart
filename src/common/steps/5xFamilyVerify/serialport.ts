/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    createSerialPort,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { AppThunk, RootState } from '../../../app/store';
import {
    DeviceWithSerialnumber,
    reset,
} from '../../../features/device/deviceLib';
import { setResponse } from './verifySlice';

const decoder = new TextDecoder();

export default (
        device: DeviceWithSerialnumber,
        vComIndex: number
    ): AppThunk<RootState, Promise<() => void>> =>
    async dispatch => {
        const path = device.serialPorts?.[vComIndex].comName;

        if (!path) {
            throw new Error('Failed to find valid serialport');
        }

        let sp: Awaited<ReturnType<typeof createSerialPort>>;

        try {
            sp = await createSerialPort(
                {
                    path,
                    baudRate: 115200,
                },
                { overwrite: true, settingsLocked: true }
            );
        } catch (e) {
            logger.error(e);
            throw new Error('Failed to communicate with device');
        }

        const unregister = sp.onData(data =>
            dispatch(setResponse(decoder.decode(data)))
        );

        const cleanup = () => {
            unregister();
            sp.close();
        };

        try {
            await reset(device);
        } catch (e) {
            logger.error(e);
            cleanup();
            throw new Error('Failed to reset device');
        }

        return cleanup;
    };
