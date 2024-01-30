/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { Resource } from '../../common/Resource';
import { getStepConfiguration } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main>
            <Main.Content heading="Recommended learning resources">
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-6">
                    {getStepConfiguration('learn', device).resources.map(
                        props => (
                            <Resource {...props} key={props.label} />
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
