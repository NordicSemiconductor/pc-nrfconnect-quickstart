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
            <p>There are two pre-activated SIM cards in the kit:</p>
            <br />
            <ol className="tw-list-outside tw-list-disc tw-pl-4">
                <li>
                    <Link
                        label="SIM card from Onomondo"
                        href="https://onomondo.com/go/nordic-dev-kit/#form"
                        color="tw-text-primary"
                    />{' '}
                    with 10 MB free data.
                    <br />
                    If you register the SIM card, you will get additional 40 MB
                    to use within 60 days and access to the real-time network
                    insight tool.
                </li>
                <br />
                <li>
                    <Link
                        label="SIM card from Wireless Logic"
                        href="https://www.wirelesslogic.com/simclaim/nsctrial/"
                        color="tw-text-primary"
                    />{' '}
                    with 5 MB free data for 6 months.
                    <br />
                    If you register the SIM card within the trial period, you
                    will get additional 45 MB to use within 5 years.
                </li>
            </ol>
            <br />
            <p>
                Select the SIM card that is supported in your area (check the
                links), plug it in, and it will work out of the box.
            </p>
        </Main.Content>
        <Main.Footer>
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);

export default () => ({
    name: 'SIMCard',
    component: SIMCard,
});
