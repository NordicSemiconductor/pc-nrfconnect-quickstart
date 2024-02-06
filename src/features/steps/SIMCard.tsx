/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { Back } from '../../common/Back';
import Link from '../../common/Link';
import Main from '../../common/Main';
import { Next } from '../../common/Next';

export default () => (
    <Main>
        <Main.Content heading="Activate iBasis SIM card">
            <p>
                If you are using the included iBasis SIM card, you need to
                register and enable it through nRF Cloud.
            </p>
            <br />
            <p>
                If you have activated your iBasis SIM card before or are using a
                SIM card from a different provider, you can skip this
                configuration step.
            </p>
            <br />
            <br />
            <b>Complete the following steps in nRF Cloud:</b>
            <br />
            <br />
            <ol className="tw-list-outside tw-list-decimal tw-pl-4">
                <li>
                    Log in to your account on{' '}
                    <Link
                        label="nRF Cloud"
                        href="https://nrfcloud.com/"
                        color="tw-text-primary"
                    />{' '}
                    or create one.
                </li>
                <br />
                <li>
                    <Link
                        label="Activate SIM card"
                        href="nrfcloud.com/#/add-device/sim/verify"
                        color="tw-text-primary"
                    />
                    .
                </li>
            </ol>
        </Main.Content>
        <Main.Footer>
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);
