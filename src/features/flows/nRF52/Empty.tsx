/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';

const InfoStep = ({ name }: { name: string }) => (
    <Main>
        <Main.Content heading={name}>Sample text</Main.Content>
        <Main.Footer>
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);

export default (name: string) => ({
    name,
    component: () => InfoStep({ name }),
});
