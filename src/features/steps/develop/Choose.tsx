/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';

import vscodeIcon from '../../../../resources/vscode.svg';
import vscodeAltIcon from '../../../../resources/vscode-alt.svg';
import { useAppDispatch } from '../../../app/store';
import { Back } from '../../../common/Back';
import Italic from '../../../common/Italic';
import { ListItemVariant } from '../../../common/listSelect/ListSelectItem';
import { RadioSelect } from '../../../common/listSelect/RadioSelect';
import Main from '../../../common/Main';
import { Next, Skip } from '../../../common/Next';
import { DevelopState, setDevelopState } from './developSlice';
import { detectVsCode } from './vsCodeEffects';

type Item = ListItemVariant & {
    state: DevelopState;
};

export default () => {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState<Item>();

    useEffect(() => {
        detectVsCode(dispatch);
    }, [dispatch]);

    const items = [
        {
            id: 'vscode',
            state: DevelopState.OPEN_VS_CODE,
            selected: selected?.id === 'vscode',
            content: (
                <div className="tw-flex tw-flex-row tw-items-start tw-justify-start tw-text-sm">
                    <div className="tw-w-32 tw-flex-shrink-0 tw-pr-10">
                        <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
                            <b>VS Code IDE</b>
                            <img
                                src={
                                    selected?.id === 'vscode'
                                        ? vscodeAltIcon
                                        : vscodeIcon
                                }
                                alt="VS Code icon"
                                className="tw-h-10 tw-w-10"
                            />
                        </div>
                    </div>
                    <div>
                        The <Italic>nRF Connect for Visual Studio Code</Italic>{' '}
                        extension is the recommended development environment for
                        building and debugging applications based on the{' '}
                        <Italic>nRF Connect SDK</Italic>.
                    </div>
                </div>
            ),
        },
        {
            id: 'cli',
            state: DevelopState.CLI,
            selected: selected?.id === 'cli',
            content: (
                <div className="tw-flex tw-flex-row tw-items-start tw-justify-start tw-text-sm">
                    <div className="tw-w-32 tw-flex-shrink-0 tw-pr-5">
                        <div>
                            <b>Command Line</b>
                        </div>
                    </div>
                    <div>
                        The <Italic>nRF Util</Italic> and <Italic>west</Italic>{' '}
                        command line tools can be used to manually configure
                        your custom environment.
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Main>
            <Main.Content heading="How would you like to start developing">
                <RadioSelect items={items} onSelect={setSelected} />
            </Main.Content>
            <Main.Footer>
                <Back />
                <Skip />
                <Next
                    disabled={!selected}
                    onClick={() => {
                        if (selected == null) {
                            return;
                        }

                        usageData.sendUsageData(
                            `Selected developing option: ${selected.id}`
                        );

                        dispatch(setDevelopState(selected.state));
                    }}
                />
            </Main.Footer>
        </Main>
    );
};