/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import {
    apps,
    Button,
    openWindow,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppSelector } from '../app/store';
import { getSelectedDeviceUnsafely } from '../features/device/deviceSlice';
import Link from './Link';

interface Link {
    label: string;
    href: string;
}

export interface ResourceProps {
    label: string;
    description: string;
    link: Link;
}

export const Resource = ({ label, description, link }: ResourceProps) => (
    <div>
        <b>{label}</b>
        <br />
        {description}
        <div className="tw-pt-0.5 tw-text-xs">
            <Link label={link.label} href={link.href} color="tw-text-primary" />
        </div>
    </div>
);

interface ResourceWithButtonProps {
    title: string;
    description: string | React.ReactNode;
    buttonLabel: string;
    onClick: () => void;
    links?: Link[];
    disabled?: boolean;
}

export const ResourceWithButton = ({
    title,
    description,
    links,
    buttonLabel,
    disabled,
    onClick,
}: ResourceWithButtonProps) => (
    <div className="tw-flex tw-flex-row tw-justify-between tw-gap-10">
        <div className="tw-w-80">
            <div>
                <b>{title}</b>
            </div>
            {description}
            {links?.map(({ label, href }) => (
                <div key={label} className="tw-pt-0.5 tw-text-xs">
                    <Link label={label} href={href} color="tw-text-primary" />
                </div>
            ))}
        </div>
        <Button
            variant="link-button"
            size="xl"
            disabled={disabled}
            onClick={onClick}
            className="tw-flex-1"
        >
            {buttonLabel}
        </Button>
    </div>
);

export const AppResourceButton = ({
    description,
    links,
    disabled,
    app,
    onInstallStart,
    onInstallFinish,
}: {
    description: string;
    app: string;
    links?: Link[];
    disabled?: boolean;
    onInstallStart?: () => void;
    onInstallFinish?: () => void;
}) => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const [displayName, setDisplayName] = useState(app);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        apps.getDownloadableApps().then(({ apps: receivedApps }) => {
            const updatedAppInfo = receivedApps.find(a => a.name === app);
            setDisplayName(updatedAppInfo?.displayName || app);
        });
    }, [app]);

    return (
        <div className="tw-flex tw-flex-row tw-justify-between tw-gap-10">
            <div className="tw-w-80">
                <div>
                    <b>{displayName}</b>
                </div>
                {description}
                {links?.map(({ label, href }) => (
                    <div key={label} className="tw-pt-0.5 tw-text-xs">
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
                disabled={disabled || isInstalling}
                onClick={async () => {
                    const appInfo = await apps
                        .getDownloadableApps()
                        .then(({ apps: receivedApps }) =>
                            receivedApps.find(
                                a => a.name === app && a.source === 'official'
                            )
                        );

                    if (appInfo && !apps.isInstalled(appInfo)) {
                        setIsInstalling(true);
                        onInstallStart?.();
                        await apps.installDownloadableApp(appInfo);
                        setIsInstalling(false);
                        onInstallFinish?.();
                    }

                    openWindow.openApp(
                        {
                            name: app,
                            source: 'official',
                        },
                        {
                            device: {
                                serialNumber: device.serialNumber,
                            },
                        }
                    );

                    telemetry.sendEvent('Opened evaluation app', {
                        app,
                    });
                }}
                className="tw-flex-1"
            >
                {isInstalling ? 'Installing...' : `Open ${displayName}`}
            </Button>
        </div>
    );
};
