/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

interface ListItem {
    id: string;
    content: React.ReactNode;
}

export interface SelectableListItem extends ListItem {
    selected: boolean;
}

export interface DisabledListItem extends ListItem {
    disabled: true;
    disabledSelector: React.ReactNode;
}

export type ListItemVariant = SelectableListItem | DisabledListItem;

const invokeIfSpaceOrEnterPressed =
    (onClick: React.KeyboardEventHandler<Element>) =>
    (event: React.KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === ' ' || event.key === 'Enter') {
            onClick(event);
        }
    };

const blurAndInvoke =
    (
        onClick: React.MouseEventHandler<HTMLElement>
    ): React.MouseEventHandler<HTMLElement> =>
    (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.currentTarget.blur();
        onClick(event);
    };

export const SelectableItem = ({
    onSelect,
    children,
    selected,
    selector,
}: {
    onSelect: () => void;
    children: React.ReactNode;
    selected: boolean;
    selector?: React.ReactNode;
}) => (
    <div
        role="button"
        tabIndex={0}
        onClick={blurAndInvoke(() => onSelect())}
        onKeyUp={invokeIfSpaceOrEnterPressed(() => onSelect())}
        className={classNames(
            'tw-flex tw-w-full tw-cursor-pointer tw-flex-row tw-items-center tw-justify-between tw-gap-px tw-p-4',
            selected && 'tw-bg-primary tw-text-gray-50',
            !selected && 'tw-bg-gray-50 tw-text-gray-700 hover:tw-bg-gray-100'
        )}
    >
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div>{children}</div>
        {selector}
    </div>
);

export const DisabledListItemContainer = ({
    children,
    disabledSelector,
}: {
    children: React.ReactNode;
    disabledSelector?: React.ReactNode;
}) => (
    <div className="tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between tw-gap-px tw-bg-gray-50 tw-p-4 tw-opacity-40">
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div>{children}</div>
        {!!disabledSelector && disabledSelector}
    </div>
);
