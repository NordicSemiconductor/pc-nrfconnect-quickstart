/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from '../../app/store';
import { type Choice } from './deviceGuides';

export interface DeviceWithRequiredSerialNumber extends Device {
    serialNumber: string;
}

interface State {
    choice?: Choice;
    connectedDevices: Map<string, DeviceWithRequiredSerialNumber>;
    selectedDevice?: DeviceWithRequiredSerialNumber;
}

const initialState: State = {
    connectedDevices: new Map(),
};

const slice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (
            state,
            { payload: device }: PayloadAction<DeviceWithRequiredSerialNumber>
        ) => {
            state.connectedDevices.set(device.serialNumber, device);
        },

        removeDevice: (state, { payload: deviceId }: PayloadAction<number>) => {
            state.connectedDevices.forEach(device => {
                if (device.id === deviceId) {
                    state.connectedDevices.delete(device.serialNumber);
                }
            });
        },

        selectDevice: (
            state,
            {
                payload: device,
            }: PayloadAction<DeviceWithRequiredSerialNumber | undefined>
        ) => {
            state.selectedDevice = device;
        },

        setChoice: (
            state,
            { payload: choice }: PayloadAction<Choice | undefined>
        ) => {
            state.choice = choice;
        },
    },
});

export const { addDevice, removeDevice, selectDevice, setChoice } =
    slice.actions;

export const getConnectedDevices = (state: RootState) => [
    ...state.device.connectedDevices.values(),
];
export const getSelectedDevice = (state: RootState) =>
    state.device.selectedDevice;

export const getSelectedDeviceUnsafely = (state: RootState) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Because we are certain based on the step that a device is selected
    state.device.selectedDevice!;

export const getChoice = (state: RootState) => state.device.choice;

export default slice.reducer;
