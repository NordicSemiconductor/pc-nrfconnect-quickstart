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

import { useAppDispatch, useAppSelector } from '../../../app/store';
import ListSelect, {
    type DisabledListItem,
    type SelectableListItem,
} from '../../../common/ListSelect';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import {
    DeviceIcon,
    deviceName,
    isSupportedDevice,
} from '../../device/deviceGuides';
import { getConnectedDevices, selectDevice } from '../../device/deviceSlice';
import Searching from './Searching';

export default () => {
    const dispatch = useAppDispatch();
    const connectedDevices = useAppSelector(getConnectedDevices);
    const [selectedItem, setSelectedItem] = useState<
        SelectableListItem | DisabledListItem
    >();

    const items = connectedDevices.map(device => {
        const isSelected = selectedItem?.id === device.serialNumber;
        return {
            id: device.serialNumber,
            selected: isSelected,
            disabled: !isSupportedDevice(device),
            disabledRadioButton: (
                <p className="tw-text-xs">Not supported yet</p>
            ),
            content: (
                <div className="tw-flex tw-flex-row tw-items-center tw-justify-start">
                    <div className="tw-w-28">
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
                    <p className="tw-w-44 tw-overflow-ellipsis tw-text-sm">
                        <b>
                            {getPersistedNickname(device.serialNumber) ||
                                deviceName(device)}
                        </b>
                    </p>
                    <p className="tw-overflow-ellipsis tw-text-xs">
                        {device.serialNumber}
                    </p>
                </div>
            ),
        };
    });

    return (
        <Main>
            <Main.Content heading="Select a kit">
                <ListSelect items={items} onSelect={setSelectedItem} />
                <div className="tw-pt-5">
                    <Searching />
                </div>
            </Main.Content>
            <Main.Footer>
                <Next
                    disabled={!selectedItem}
                    onClick={next => {
                        const selectedDevice = connectedDevices.find(
                            device => device.serialNumber === selectedItem?.id
                        );
                        dispatch(selectDevice(selectedDevice));
                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
