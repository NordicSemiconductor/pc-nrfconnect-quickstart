/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';

interface State {
    connectedDevices: Map<string, Device>;
}

const initialState: State = {
    connectedDevices: new Map(),
};

const slice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, { payload: device }: PayloadAction<Device>) => {
            state.connectedDevices.set(device.serialNumber, device);
        },

        removeDevice: (state, { payload: deviceId }: PayloadAction<number>) => {
            state.connectedDevices.forEach(device => {
                if (device.id === deviceId) {
                    state.connectedDevices.delete(device.serialNumber);
                }
            });
        },
    },
});

export const { addDevice, removeDevice } = slice.actions;

export const getConnectedDevices = (state: RootState) => [
    ...state.device.connectedDevices.values(),
];
export default slice.reducer;
