/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    openUrl,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Heading from '../../common/Heading';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { deviceLinks, deviceName } from '../device/deviceGuides';
import { getChoice, getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const choice = useAppSelector(getChoice);

    return (
        <Main device={device}>
            <Main.Content>
                <Heading>
                    We recommend these resources for learning more about{' '}
                    {deviceName(device)}
                </Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-10">
                    {deviceLinks(device, choice).map(({ label, href }) => (
                        <Button
                            key={label}
                            variant="link-button"
                            onClick={() => {
                                usageData.sendUsageData('Opening url', href);
                                openUrl(href);
                            }}
                            large
                            className="tw-w-96 tw-text-left"
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
