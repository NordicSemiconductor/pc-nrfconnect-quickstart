/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { queryParamsString } from './OpenVsCode';

describe('queryParamsString', () => {
    it('converts all parameters to a query string', () => {
        expect(
            queryParamsString({
                aParam: 'aValue',
                anotherParam: 'anotherValue',
            })
        ).toMatch(
            /aParam=aValue&anotherParam=anotherValue|anotherParam=anotherValue&aParam=aValue/
        );
    });

    it('escapes special characters', () => {
        expect(
            queryParamsString({ param: 'special characters follow /?&=\\' })
        ).toBe('param=special%20characters%20follow%20%2F%3F%26%3D%5C');
    });

    it('filters out undefined parameters', () => {
        expect(
            queryParamsString({
                param: 'something',
                notDefined: undefined,
                notSet: null,
            })
        ).toBe('param=something');
    });
});
