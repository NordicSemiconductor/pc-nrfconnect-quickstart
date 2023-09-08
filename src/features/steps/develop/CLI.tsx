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
import { DevelopState, setDevelopState } from './developSlice';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Install VS Code">
                <div className="tw-flex tw-flex-col tw-gap-6">
                    <div>
                        <b>Install nRF Connect SDK and toolchain manually</b>
                        <p>Install manually using the command line</p>
                        <Link
                            color="tw-text-primary"
                            href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/installation/installing.html"
                            label="Manual installation instructions"
                        />
                    </div>

                    <div>
                        <b>nRF Util</b>
                        <p>
                            A modular command line tool, enabling power users to
                            manage Nordic Semiconductor devices and support
                            automation.
                        </p>
                        <Link
                            color="tw-text-primary"
                            href="https://www.nordicsemi.com/Products/Development-tools/nrf-util"
                            label="nRF Util documentation"
                        />
                    </div>

                    <div>
                        <b>West</b>
                        <p>
                            A tool for managing multiple Git repositories and
                            versions. It is extendable with custom commands and
                            features.
                        </p>
                        <Link
                            color="tw-text-primary"
                            href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/zephyr/develop/west"
                            label="West overview"
                        />
                    </div>
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
