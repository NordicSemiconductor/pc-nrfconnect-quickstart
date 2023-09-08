/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';

import { useAppDispatch } from '../../../app/store';
import { Back } from '../../../common/Back';
import Link from '../../../common/Link';
import Main from '../../../common/Main';
import { Skip } from '../../../common/Next';
import { DevelopState, setDevelopState } from './developSlice';
import { detectVsCodeRepeatedly } from './vsCodeEffects';

type SupportedPlatform = 'win32' | 'darwin' | 'linux';

const installLink = {
    win32: 'https://code.visualstudio.com/docs/setup/windows',
    darwin: 'https://code.visualstudio.com/docs/setup/mac',
    linux: 'https://code.visualstudio.com/docs/setup/linux',
}[process.platform as SupportedPlatform];

export default () => {
    const dispatch = useAppDispatch();

    useEffect(() => detectVsCodeRepeatedly(dispatch), [dispatch]);

    return (
        <Main>
            <Main.Content heading="Install VS Code">
                You first need to{' '}
                <Link href={installLink} label="download and install VS Code" />
                .
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={() => {
                        dispatch(setDevelopState(DevelopState.CHOOSE));
                    }}
                />
                <Skip />
            </Main.Footer>
        </Main>
    );
};
