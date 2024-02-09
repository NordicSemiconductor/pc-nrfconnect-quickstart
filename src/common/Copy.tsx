/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { clipboard } from 'electron';

export default ({ copyText }: { copyText: string }) => (
    <button
        type="button"
        className="tw-inline tw-h-min tw-p-0"
        onClick={() => clipboard.writeText(copyText)}
    >
        <span className="mdi mdi-content-copy tw-inline tw-leading-none active:tw-text-primary" />
    </button>
);
