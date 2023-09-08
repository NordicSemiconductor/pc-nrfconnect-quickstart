/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { sendFeedback } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Back } from '../../../common/Back';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [feedback, setFeedback] = useState('');

    return (
        <Main>
            <Main.Content heading="Give feedback">
                <form>
                    <textarea
                        name="feedback-text"
                        className="tw-h-44 tw-w-full tw-resize-none tw-border tw-border-gray-200 tw-p-2 focus:tw-outline-none"
                        required
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                    />
                </form>
                <div className="tw-pt-7">
                    Submissions will not receive a response.
                    <br />
                    For general help and support visit{' '}
                    <u>
                        <b>Nordic DevZone</b>
                    </u>
                </div>
            </Main.Content>
            <Main.Footer>
                <Back onClick={back} />
                <Next
                    label="Give feedback"
                    onClick={() => {
                        try {
                            sendFeedback(feedback);
                        } catch (e) {
                            console.error(e);
                        }

                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
