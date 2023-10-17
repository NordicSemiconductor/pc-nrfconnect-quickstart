/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    classNames,
    getPersistedNickname,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { ListItemVariant } from '../../common/listSelect/ListSelectItem';
import { RadioSelect } from '../../common/listSelect/RadioSelect';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import Searching from '../../common/Searching';
import {
    DeviceIcon,
    deviceName,
    getStepOrder,
    isSupportedDevice,
} from '../device/deviceGuides';
import { getConnectedDevices, selectDevice } from '../device/deviceSlice';
import { setSteps } from '../steps/stepsSlice';

export default () => {
    const dispatch = useAppDispatch();
    const connectedDevices = useAppSelector(getConnectedDevices);
    const [selectedItem, setSelectedItem] = useState<ListItemVariant>();

    const items = connectedDevices.map(device => {
        const isSelected = selectedItem?.id === device.serialNumber;
        const name =
            getPersistedNickname(device.serialNumber) ||
            deviceName(device) ||
            '';
        return {
            id: device.serialNumber,
            selected: isSelected,
            disabled: !isSupportedDevice(device),
            disabledSelector: <p className="tw-text-xs">Not supported yet</p>,
            content: (
                <div className="tw-flex tw-flex-row tw-items-center tw-justify-start">
                    <div className="tw-w-28 tw-flex-shrink-0">
                        <DeviceIcon
                            device={device}
                            className={classNames(
                                'tw-h-5',
                                isSelected
                                    ? 'tw-fill-white'
                                    : 'tw-fill-gray-700'
                            )}
                        />
                    </div>
                    <p
                        className="tw-w-44 tw-flex-shrink-0 tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap tw-pr-6 tw-text-sm"
                        title={name}
                    >
                        <b>{name}</b>
                    </p>
                    <p
                        className="tw-w-32 tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap tw-text-xs"
                        title={device.serialNumber}
                    >
                        {device.serialNumber}
                    </p>
                </div>
            ),
        };
    });

    return (
        <Main>
            <Main.Content heading="Select a kit">
                <div className="tw-flex tw-flex-row tw-justify-start tw-px-4 tw-pb-2">
                    <b className="tw-w-28">Family</b>
                    <b className="tw-w-44">Device</b>
                    <b className="tw-w-44">Serial number</b>
                    <b>Estimated time</b>
                </div>
                <RadioSelect items={items} onSelect={setSelectedItem} />
                <div className="tw-pt-5">
                    <Searching />
                </div>
            </Main.Content>
            <Main.Footer>
                <Next
                    disabled={!selectedItem}
                    onClick={() => {
                        const selectedDevice = connectedDevices.find(
                            device => device.serialNumber === selectedItem?.id
                        );
                        if (selectedDevice) {
                            dispatch(setSteps(getStepOrder(selectedDevice)));
                            dispatch(selectDevice(selectedDevice));
                        }
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
