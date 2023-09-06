/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';

import Feedback from './Feedback';
import Finish from './Finish';

export default () => {
    const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
    const [giveFeedback, setGiveFeedback] = useState(false);

    return giveFeedback ? (
        <Feedback
            back={() => setGiveFeedback(false)}
            onGiveFeedback={() => {
                setHasGivenFeedback(true);
                setGiveFeedback(false);
            }}
        />
    ) : (
        <Finish
            withFeedbackOption={!hasGivenFeedback}
            giveFeedback={() => setGiveFeedback(true)}
        />
    );
};
