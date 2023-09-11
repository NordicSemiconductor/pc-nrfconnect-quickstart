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
import { Skip } from '../../../common/Next';
import { DevelopState, setDevelopState } from './developSlice';

type SupportedPlatform = 'win32' | 'darwin' | 'linux';

const installLink = {
    win32: 'https://code.visualstudio.com/docs/setup/windows',
    darwin: 'https://code.visualstudio.com/docs/setup/mac',
    linux: 'https://code.visualstudio.com/docs/setup/linux',
}[process.platform as SupportedPlatform];

const onWindows = process.platform === 'win32';

export default () => {
    const dispatch = useAppDispatch();

    return (
        <Main>
            <Main.Content heading="Install VS Code">
                <div className="tw-flex tw-flex-col tw-gap-6">
                    <p>
                        You first need to{' '}
                        <Link
                            href={installLink}
                            label="download and install VS Code"
                            color="tw-text-primary"
                        />
                        .
                    </p>
                    {onWindows && (
                        <p>
                            If you already installed VS code, it may be corrupt
                            and you may need to reinstall it.
                        </p>
                    )}
                </div>
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
