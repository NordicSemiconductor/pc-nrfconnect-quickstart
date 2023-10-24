/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Button } from '@nordicsemiconductor/pc-nrfconnect-shared';

import type { Link as LinkType } from '../features/device/deviceGuides';
import Link from './Link';

interface ResourceProps {
    label: string;
    description: string;
    link: LinkType;
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
    description: string;
    buttonLabel: string;
    onClick: () => void;
    links?: LinkType[];
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
