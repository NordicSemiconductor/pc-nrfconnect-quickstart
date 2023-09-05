/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { classNames } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    DisabledListItem,
    DisabledListItemContainer,
    SelectableItem,
    SelectableListItem,
} from './ListSelectItem';

const RadioSelectListItem = ({
    onSelect,
    children,
    selected,
}: {
    onSelect: () => void;
    children: React.ReactNode;
    selected: boolean;
}) => (
    <SelectableItem onSelect={onSelect} selected={selected}>
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div className="tw-pr-10">{children}</div>
        <span
            className={classNames(
                selected
                    ? 'mdi-radiobox-marked tw-text-gray-50'
                    : 'mdi-radiobox-blank tw-text-primary',
                `mdi tw-text-xl tw-leading-none`
            )}
        />
    </SelectableItem>
);

export const RadioSelect = ({
    items,
    onSelect,
}: {
    items: (SelectableListItem | DisabledListItem)[];
    onSelect: (item: SelectableListItem) => void;
}) => (
    <div className="tw-flex tw-flex-col tw-gap-px">
        {items.map(item =>
            (item as DisabledListItem).disabled ? (
                <DisabledListItemContainer
                    key={item.id}
                    disabledSelector={
                        (item as DisabledListItem).disabledRadioButton
                    }
                >
                    {item.content}
                </DisabledListItemContainer>
            ) : (
                <RadioSelectListItem
                    key={item.id}
                    onSelect={() => onSelect(item as SelectableListItem)}
                    selected={(item as SelectableListItem).selected}
                >
                    {item.content}
                </RadioSelectListItem>
            )
        )}
    </div>
);
