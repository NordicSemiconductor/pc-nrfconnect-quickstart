/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    Button,
    DownloadableApp,
    usageData,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Link from '../../common/Link';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import {
    EvaluationResource,
    ExternalLinkEvaluationResource,
} from '../device/deviceGuides';
import { getChoiceUnsafely } from '../device/deviceSlice';

export default () => {
    const choice = useAppSelector(getChoiceUnsafely);
    const [downloadableApps, setDownloadableApps] = useState<DownloadableApp[]>(
        []
    );

    const isExternalLinkResource = (
        resource: EvaluationResource
    ): resource is ExternalLinkEvaluationResource => 'link' in resource;

    const getAppName = (app: string) =>
        downloadableApps.find(a => a.name === app)?.displayName || app;

    useEffect(() => {
        apps.getDownloadableApps().then(({ apps: receivedApps }) =>
            setDownloadableApps(receivedApps)
        );
    }, [choice.evaluationResources]);

    return (
        <Main>
            <Main.Content heading={`Evaluate ${choice.name}`}>
                <div className="tw-flex tw-flex-col tw-gap-6">
                    {choice.evaluationResources.map(resource => (
                        <div
                            key={
                                isExternalLinkResource(resource)
                                    ? resource.title
                                    : resource.app
                            }
                            className="tw-flex tw-flex-row tw-justify-between tw-gap-12"
                        >
                            <div className="tw-w-80">
                                <div>
                                    <b>
                                        {isExternalLinkResource(resource)
                                            ? resource.title
                                            : getAppName(resource.app)}
                                    </b>
                                </div>
                                {resource.description}
                                {resource.links?.map(({ label, href }) => (
                                    <div
                                        key={label}
                                        className="tw-pt-0.5 tw-text-xs"
                                    >
                                        <Link
                                            label={label}
                                            href={href}
                                            color="tw-text-primary"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="link-button"
                                size="xl"
                                onClick={() => {
                                    usageData.sendUsageData(
                                        isExternalLinkResource(resource)
                                            ? `Opened link ${resource.link.href}`
                                            : `Opened app ${resource.app}`
                                    );
                                    // install and open or something
                                }}
                                className="tw-flex-1"
                            >
                                {isExternalLinkResource(resource)
                                    ? resource.link.label
                                    : `Open ${getAppName(resource.app)}`}
                            </Button>
                        </div>
                    ))}
                </div>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
