/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

export const formatResponse = (response: string, responseRegex: string) => {
    const regex = new RegExp(responseRegex);
    const filteredResponse =
        response
            .split('\nOK', 1)[0]
            .split('\n')
            .filter(line => !!line.trim())
            .at(-1) ?? '';

    const [, match] = filteredResponse.match(regex) ?? [];

    return match;
};
