/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    Button,
    getPersistedNickname,
    persistNickname,
} from 'pc-nrfconnect-shared';

import Heading from './Heading';
import Main from './Main';

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [nickname, setNickname] = React.useState(
        getPersistedNickname('serialnumber')
    );
    const maxLength = 20;

    return (
        <Main>
            <Main.Header showDevice />
            <Main.Content>
                <Heading>First, give your kit a custom name</Heading>
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-12 tw-pt-10">
                    <div className="tw-flex tw-w-64 tw-flex-col tw-items-center">
                        <div className="tw-self-end tw-text-xs">{`${nickname.length}/${maxLength}`}</div>
                        <input
                            placeholder="Name your device"
                            onChange={event => setNickname(event.target.value)}
                            value={nickname}
                            maxLength={maxLength}
                            className="tw-h-8 tw-w-full tw-border tw-border-solid tw-border-gray-300 tw-px-2 tw-py-4"
                        />
                    </div>
                    <p className="tw-max-w-sm">
                        We&apos;ll remember and display the custom name when you
                        use our apps. You can always change the name later.
                        Click skip if you prefer to keep the default name.
                    </p>
                </div>
            </Main.Content>
            <Main.Footer>
                <Button variant="secondary" large onClick={back}>
                    Back
                </Button>
                <div className="tw-flex tw-flex-row tw-gap-2 tw-pl-20">
                    <Button variant="secondary" large onClick={next}>
                        Skip
                    </Button>
                    <Button
                        variant="primary"
                        large
                        onClick={() => {
                            if (nickname.trim().length > 0) {
                                // TODO set nickname in redux store so other tab titles get updated
                                persistNickname('serialnumber', nickname);
                            }
                            next();
                        }}
                    >
                        Next
                    </Button>
                </div>
            </Main.Footer>
        </Main>
    );
};
