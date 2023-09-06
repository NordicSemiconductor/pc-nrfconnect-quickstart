/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { usageData } from '@nordicsemiconductor/pc-nrfconnect-shared';

import vscodeIcon from '../../../../resources/vscode.svg';
import vscodeAltIcon from '../../../../resources/vscode-alt.svg';
import { Back } from '../../../common/Back';
import Italic from '../../../common/Italic';
import { ListItemVariant } from '../../../common/listSelect/ListSelectItem';
import { RadioSelect } from '../../../common/listSelect/RadioSelect';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';

export default () => {
    const [selected, setSelected] = useState<ListItemVariant>();

    const items = [
        {
            id: 'vscode',
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
                <Next variant="link-button" label="Skip" />
                <Next
                    label="Continue"
                    disabled={!selected}
                    onClick={next => {
                        usageData.sendUsageData(
                            `Selected developing option: ${selected?.id}`
                        );

                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
