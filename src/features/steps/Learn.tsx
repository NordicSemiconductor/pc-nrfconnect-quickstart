/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { ExternalLink } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { deviceLearningResources } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main>
            <Main.Content heading="Recommended learning resources">
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {deviceLearningResources(device).map(
                        ({ label, description, link }) => (
                            <div key={label}>
                                <b>{label}</b>
                                <br />
                                {description}
                                <div className="tw-pt-0.5 tw-text-xs">
                                    <ExternalLink
                                        label={link.label}
                                        href={link.href}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
