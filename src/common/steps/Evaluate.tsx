/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import {
    openUrl,
    Spinner,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../../app/store';
import { getChoiceUnsafely } from '../../features/device/deviceSlice';
import { Back } from '../Back';
import Main from '../Main';
import { Next } from '../Next';
import { AppResourceButton, ResourceWithButton } from '../Resource';

interface CommonResourceProps {
    description: string;
    supplementaryLinks?: { label: string; href: string }[];
}

interface ExternalLinkResource extends CommonResourceProps {
    title: string;
    mainLink: { label: string; href: string };
}

interface AppResource extends CommonResourceProps {
    app: string;
}

const isExternalLinkResource = (
    resource: AppResource | ExternalLinkResource
): resource is ExternalLinkResource => 'mainLink' in resource;

interface ResourcePage {
    ref: string;
    resources: (AppResource | ExternalLinkResource)[];
}

const EvaluateStep = ({ resourcePages }: { resourcePages: ResourcePage[] }) => {
    const [busy, setBusy] = useState(false);
    const choice = useAppSelector(getChoiceUnsafely);

    const resources =
        resourcePages.find(resource => resource.ref === choice.name)
            ?.resources || [];

    return (
        <Main>
            <Main.Content heading={`Evaluate ${choice.name}`}>
                <div className="tw-flex tw-flex-col tw-gap-6">
                    {resources.map(resource =>
                        isExternalLinkResource(resource) ? (
                            <ResourceWithButton
                                key={resource.title}
                                title={resource.title}
                                buttonLabel={resource.mainLink.label}
                                description={resource.description}
                                links={resource.supplementaryLinks}
                                onClick={() => {
                                    telemetry.sendEvent(
                                        'Opened evaluation link',
                                        {
                                            link: resource.mainLink.href,
                                        }
                                    );
                                    openUrl(resource.mainLink.href);
                                }}
                            />
                        ) : (
                            <AppResourceButton
                                key={resource.app}
                                description={resource.description}
                                app={resource.app}
                                links={resource.supplementaryLinks}
                                onInstallStart={() => setBusy(true)}
                                onInstallFinish={() => setBusy(false)}
                            />
                        )
                    )}
                </div>
            </Main.Content>
            <Main.Footer>
                {busy && (
                    <div className="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-text-primary">
                        <Spinner size="lg" />
                    </div>
                )}
                <Back disabled={busy} />
                <Next disabled={busy} />
            </Main.Footer>
        </Main>
    );
};

export default (resourcePages: ResourcePage[]) => ({
    name: 'Evaluate',
    component: () => EvaluateStep({ resourcePages }),
});
