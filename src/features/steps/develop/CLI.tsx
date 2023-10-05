/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch } from '../../../app/store';
import { Back } from '../../../common/Back';
import Link from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';
import { Resource } from '../../../common/Resource';
import { DevelopState, setDevelopState } from './developSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Command Line">
                <div className="tw-flex tw-flex-col tw-gap-6">
                    <Resource
                        label="Install nRF Connect SDK and toolchain manually"
                        description="Install manually using the command line"
                        link={{
                            href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/installation/installing.html',
                            label: 'Manual installation instructions',
                        }}
                    />
                    <Resource
                        label="nRF Util"
                        description="A modular command line tool, enabling power users to manage Nordic Semiconductor devices and support automation."
                        link={{
                            href: 'https://www.nordicsemi.com/Products/Development-tools/nrf-util',
                            label: 'nRF Util documentation',
                        }}
                    />
                    <Resource
                        label="West"
                        description="A tool for managing multiple Git repositories and versions."
                        link={{
                            href: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/zephyr/develop/west',
                            label: 'West overview',
                        }}
                    />
                </div>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setDevelopState(DevelopState.CHOOSE));
                    }}
                />
                <Next />
            </Main.Footer>
        </Main>
    );
};
