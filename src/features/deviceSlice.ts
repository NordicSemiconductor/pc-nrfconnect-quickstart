/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State } from './store';

interface DeviceState {
    connectedDevices: Map<string, Device>;
    selectedDevice?: Device;
    reconnecting: boolean;
}

const initialState: DeviceState = {
    connectedDevices: new Map(),
    selectedDevice: undefined,
    reconnecting: false,
};

const slice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action: PayloadAction<Device>) => {
            state.connectedDevices.set(
                action.payload.serialNumber,
                action.payload
            );

            if (
                state.selectedDevice &&
                state.selectedDevice.serialNumber ===
                    action.payload.serialNumber
            ) {
                state.reconnecting = false;
            }
        },
        removeDevice: (state, action: PayloadAction<number>) => {
            let deviceToRemove: string | undefined;
            state.connectedDevices.forEach((device, key) => {
                if (device.id === action.payload) {
                    deviceToRemove = key;
                }
            });

            if (deviceToRemove) {
                state.connectedDevices.delete(deviceToRemove);
                if (
                    state.selectedDevice &&
                    state.selectedDevice.id === action.payload
                ) {
                    state.reconnecting = true;
                }
            }
        },
        setSelectedDevice: (state, action: PayloadAction<Device>) => {
            state.selectedDevice = action.payload;
        },
        setReconnecting: (state, action: PayloadAction<boolean>) => {
            state.reconnecting = action.payload;
        },
        deselectDevice: state => {
            state.selectedDevice = undefined;
        },
    },
});

export const getConnectedDevices = (state: State) => [
    ...state.device.connectedDevices.values(),
];

export const getSelectedDevice = (state: State) => state.device.selectedDevice;

export const {
    actions: {
        setSelectedDevice,
        setReconnecting,
        deselectDevice,
        addDevice,
        removeDevice,
    },
    reducer,
} = slice;
