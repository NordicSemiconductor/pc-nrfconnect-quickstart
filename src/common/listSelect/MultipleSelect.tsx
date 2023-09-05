/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { SelectableItem, SelectableListItem } from './ListSelectItem';

const MultipleSelectListItem = ({
    selected,
    onSelect,
    children,
}: {
    selected: boolean;
    onSelect: (selected: boolean) => void;
    children: React.ReactNode;
}) => (
    <SelectableItem
        onSelect={() => onSelect(!selected)}
        selected={selected}
        selector={<div />}
    >
        {/* This is wrapped in a div so the flex styles are not applied */}
        <div className="tw-pr-10">{children}</div>
    </SelectableItem>
);

export default ({
    items,
    onSelect,
}: {
    items: SelectableListItem[];
    onSelect: (item: SelectableListItem, selected: boolean) => void;
}) => (
    <div className="tw-flex tw-flex-col tw-gap-px">
        {items.map(item => (
            <MultipleSelectListItem
                key={item.id}
                onSelect={selected =>
                    onSelect(item as SelectableListItem, selected)
                }
                selected={(item as SelectableListItem).selected}
            >
                {item.content}
            </MultipleSelectListItem>
        ))}
    </div>
);
