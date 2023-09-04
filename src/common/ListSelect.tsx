/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

const DisabledListItemContainer = ({
    children,
    disabledRadioButton,
}: {
    children: React.ReactNode;
    disabledRadioButton?: React.ReactNode;
}) => (
    <div className="tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between tw-gap-px tw-p-4 tw-opacity-40">
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div>{children}</div>
        {!!disabledRadioButton && disabledRadioButton}
    </div>
);

const SelectableListItemContainer = ({
    onSelect,
    children,
    selected,
}: {
    onSelect: () => void;
    children: React.ReactNode;
    selected: boolean;
}) => (
    <div
        role="button"
        tabIndex={0}
        onClick={blurAndInvoke(onSelect)}
        onKeyUp={invokeIfSpaceOrEnterPressed(onSelect)}
        className={classNames(
            'tw-flex tw-w-full tw-cursor-pointer tw-flex-row tw-items-center tw-justify-between tw-gap-px tw-p-4',
            selected && 'tw-bg-primary',
            !selected && 'tw-bg-gray-50 hover:tw-bg-gray-100'
        )}
    >
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div>{children}</div>
        <span
            className={classNames(
                selected
                    ? 'mdi-radiobox-marked tw-text-gray-50'
                    : 'mdi-radiobox-blank tw-text-primary',
                `mdi tw-self-end tw-text-xl tw-leading-none`
            )}
        />
    </div>
);

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

interface ListItem {
    id: string;
    content: React.ReactNode;
}

export interface SelectableListItem extends ListItem {
    selected: boolean;
}

export interface DisabledListItem extends ListItem {
    disabled: true;
    disabledRadioButton: React.ReactNode;
}

export default ({
    items,
    onSelect,
}: {
    items: (SelectableListItem | DisabledListItem)[];
    onSelect: (item: SelectableListItem | DisabledListItem) => void;
}) => (
    <div className="tw-flex tw-flex-col tw-gap-px">
        {items.map(item =>
            (item as DisabledListItem).disabled ? (
                <DisabledListItemContainer
                    key={item.id}
                    disabledRadioButton={
                        (item as DisabledListItem).disabledRadioButton
                    }
                >
                    {item.content}
                </DisabledListItemContainer>
            ) : (
                <SelectableListItemContainer
                    key={item.id}
                    onSelect={() => onSelect(item)}
                    selected={(item as SelectableListItem).selected}
                >
                    {item.content}
                </SelectableListItemContainer>
            )
        )}
    </div>
);
