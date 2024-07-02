/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    describeError,
    logger,
    sendFeedback,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { Back } from '../../../common/Back';
import { DevZoneLink } from '../../../common/Link';
import Main from '../../../common/Main';
import { Next } from '../../../common/Next';

export default ({ back, next }: { back: () => void; next: () => void }) => {
    const [feedback, setFeedback] = useState('');

    return (
        <Main>
            <Main.Content heading="Give feedback">
                <form>
                    <textarea
                        placeholder="Type your feedback here..."
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
                    Visit <DevZoneLink /> for general help and support.
                </div>
            </Main.Content>
            <Main.Footer>
                <Back onClick={back} />
                <Next
                    disabled={feedback.trim() === ''}
                    label="Give feedback"
                    onClick={() => {
                        try {
                            sendFeedback(feedback);
                        } catch (e) {
                            logger.error(describeError(e));
                        }

                        next();
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
