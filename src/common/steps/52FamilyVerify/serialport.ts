/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSerialPort } from '@nordicsemiconductor/pc-nrfconnect-shared';

export default async (path: string, overwrite = true) => {
    const sp = await createSerialPort(
        {
            path,
            baudRate: 115200,
        },
        { overwrite, settingsLocked: true }
    );
    sp.close();
    // do some more?
};
