/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { Back } from '../../../common/Back';
import Link from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';

const SIMCard = () => (
    <Main>
        <Main.Content heading="Plug in SIM card">
            <p>
                There is a pre-activated SIM card included that works out of the
                box, as long as the SIM card has coverage in your area:
            </p>
            <div className="tw-pt-8">
                <b>Onomondo</b>
                <p>
                    Includes 10 MB free data. If you register the SIM card, you
                    will get additional 40 MB to use within the SIM&apos;s
                    lifetime. In addition, you will get a two-month trial access
                    to Onomondo&apos;s real-time network insight tool.
                </p>
                <Link
                    label="Register ownership"
                    href="https://onomondo.com/go/nordic-dev-kit/#form"
                    color="tw-text-primary"
                />{' '}
                |{' '}
                <Link
                    label="Check coverage"
                    href="https://onomondo.com/go/nordic-dev-kit/#network"
                    color="tw-text-primary"
                />
            </div>
        </Main.Content>
        <Main.Footer>
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);

export default () => ({
    name: 'SIM',
    component: SIMCard,
});
