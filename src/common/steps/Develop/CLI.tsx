/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { useAppDispatch } from '../../../app/store';
import { Back } from '../../Back';
import Main from '../../Main';
import { Next } from '../../Next';
import { Resource } from '../../Resource';
import { DevelopState, setDevelopState } from './developSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Command Line">
                <div className="tw-flex tw-flex-col tw-gap-6">
                    <Resource
                        label="Installing the nRF Connect SDK"
                        description="Install the nRF Connect toolchain and SDK."
                        link={{
                            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/installation/install_ncs.html',
                            label: 'Manual installation instructions',
                        }}
                    />
                    <Resource
                        label="nRF Util"
                        description="A modular command line tool, enabling power users to manage Nordic Semiconductor devices and support automation."
                        link={{
                            href: 'https://docs.nordicsemi.com/bundle/nrfutil/page/README.html',
                            label: 'nRF Util documentation',
                        }}
                    />
                    <Resource
                        label="West"
                        description="A tool for managing multiple Git repositories and versions."
                        link={{
                            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/develop/west/index.html',
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
