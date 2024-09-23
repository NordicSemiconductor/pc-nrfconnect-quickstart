/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    classNames,
    getPersistedNickname,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../../app/store';
import { RadioSelect } from '../../../common/listSelect/RadioSelect';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import Searching from '../../../common/Searching';
import { DeviceIcon, deviceName } from '../../device/deviceGuides';
import { DeviceWithSerialnumber } from '../../device/deviceLib';
import {
    getConnectedDevices,
    getSelectedDevice,
    selectDevice,
} from '../../device/deviceSlice';
import flows from '../../flows';
import { setIsConnectVisible } from '../flowSlice';

const isSupportedDevice = (device: DeviceWithSerialnumber) =>
    device.devkit?.boardVersion &&
    Object.keys(flows).includes(device.devkit?.boardVersion?.toLowerCase());

export default () => {
    const dispatch = useAppDispatch();
    const connectedDevices = useAppSelector(getConnectedDevices);
    const previouslySelectedDevice = useAppSelector(getSelectedDevice);
    const [selectedSerialNumber, setSelectedSerialNumber] = useState<
        string | undefined
    >(previouslySelectedDevice?.serialNumber);

    useEffect(() => {
        if (
            !connectedDevices.find(d => d.serialNumber === selectedSerialNumber)
        ) {
            setSelectedSerialNumber(undefined);
        }
    }, [connectedDevices, selectedSerialNumber]);

    const items = connectedDevices.map(device => {
        const isSelected = selectedSerialNumber === device.serialNumber;
        const nickname = getPersistedNickname(device.serialNumber);

        return {
            id: device.serialNumber,
            selected: isSelected,
            disabled: !isSupportedDevice(device),
            disabledSelector: <p className="tw-text-xs">Not supported yet.</p>,
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
                        className="tw-w-44 tw-flex-shrink-0 tw-truncate tw-pr-6 tw-text-sm"
                        title={deviceName(device) || ''}
                    >
                        <b>{deviceName(device) || ''}</b>
                    </p>
                    <p
                        className="tw-w-44 tw-truncate tw-pr-6 tw-text-xs"
                        title={device.serialNumber}
                    >
                        {device.serialNumber}
                    </p>
                    <p
                        className="tw-max-w-[11rem] tw-truncate"
                        title={nickname}
                    >
                        {nickname}
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
                    <b>Custom name</b>
                </div>
                <RadioSelect
                    items={items}
                    onSelect={item => setSelectedSerialNumber(item.id)}
                />
                <div className="tw-pt-5">
                    <Searching />
                </div>
            </Main.Content>
            <Main.Footer>
                <Next
                    disabled={!selectedSerialNumber}
                    onClick={() => {
                        const selectedDevice = connectedDevices.find(
                            device =>
                                device.serialNumber === selectedSerialNumber
                        );
                        if (selectedDevice?.devkit?.boardVersion) {
                            try {
                                dispatch(selectDevice(selectedDevice));
                                logger.debug(
                                    `Selected device: ${deviceName(
                                        selectedDevice
                                    )}`
                                );
                                dispatch(setIsConnectVisible(false));
                            } catch (e) {
                                logger.error(e);
                            }
                        }
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
