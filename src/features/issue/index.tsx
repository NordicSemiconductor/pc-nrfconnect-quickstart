/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { logger, Overlay } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DevZoneLink } from '../../common/Link';
import type { Issue } from './issueSlice';
import { getIssue } from './issueSlice';

import './issue.scss';

const IssueContent = ({ issue }: { issue: Issue }) => (
    <div className="tw-flex tw-flex-col tw-items-start tw-gap-4 tw-p-4 tw-text-start tw-text-gray-100">
        <div>
            <p className="tw-text-base tw-text-white">
                {issue.level === 'error' ? 'Error' : 'Warning'}
            </p>
            {issue.issueContent}
        </div>
        <div>
            <p className="tw-text-base tw-text-white">Potential solutions</p>
            {issue.solutionContent}
        </div>
        <div>
            Contact support on <DevZoneLink /> if the problem persists.
            <br />
            Provide the{' '}
            <button
                type="button"
                className="tw-inline tw-h-min tw-p-0 tw-text-primary"
                onClick={() => logger.openLogFile()}
            >
                <span className="mdi mdi-text-box tw-leadning-none tw-mr-1 tw-align-middle tw-text-base" />
                Log
            </button>
            .
        </div>
    </div>
);

export default () => {
    const issue = useSelector(getIssue);

    if (!issue) return null;
    return (
        <div className="tw-flex tw-h-full tw-flex-row tw-items-center tw-justify-start">
            <span
                className={`mdi mdi-alert tw-mr-2 tw-text-3xl tw-leading-7 ${
                    issue.level === 'error' ? 'tw-text-red' : 'tw-text-orange'
                }`}
            />
            <Overlay
                keepShowingOnHoverTooltip
                tooltipId="issue"
                placement="top-start"
                tooltipChildren={<IssueContent issue={issue} />}
            >
                <p className="tw-border-b-2 tw-border-dotted">More details</p>
            </Overlay>
        </div>
    );
};
