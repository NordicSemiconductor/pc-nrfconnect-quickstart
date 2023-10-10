/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { clipboard } from 'electron';

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

export default ({ copyText }: { copyText: string }) => (
    <span
        role="button"
        className="mdi mdi-content-copy tw-leading-none active:tw-text-primary"
        tabIndex={0}
        onClick={blurAndInvoke(() => clipboard.writeText(copyText))}
        onKeyUp={invokeIfSpaceOrEnterPressed(() =>
            clipboard.writeText(copyText)
        )}
    />
);
