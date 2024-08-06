/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import Apps from '../../../common/steps/Apps';
import Develop from '../../../common/steps/develop';
import Info from '../../../common/steps/Info';
import Program from '../../../common/steps/program';
import { Choice } from '../../../common/steps/program/programSlice';
import Rename from '../../../common/steps/Rename';
import Empty from './Empty';

const infoConfig = {
    title: 'Sample text',
    markdownContent: 'Text about 52',
};

const programConfig = [
    {
        name: 'Hello World',
        type: 'jlink',
        description: 'Check that UART is working with this sample.',
        documentation: {
            label: 'Hello world',
            href: '',
        },
        firmware: [
            {
                core: 'Application',
                file: '',
                link: {
                    label: 'Hello world',
                    href: '',
                },
            },
        ],
    },
    {
        name: 'Led and button sample',
        type: 'jlink',
        description:
            'Check that the LED&apos;s and buttons on the DK are working with this sample.',
        documentation: {
            label: 'LBS',
            href: '',
        },
        firmware: [
            {
                core: 'Application',
                file: '',
                link: {
                    label: 'Led and button sample',
                    href: '',
                },
            },
        ],
    },
    {
        name: 'Bluetooth UART Sample',
        type: 'jlink',
        description: 'Check that UART over BLE is working.',
        documentation: {
            label: 'Peripheral UART',
            href: '',
        },
        firmware: [
            {
                core: 'Application',
                file: '',
                link: {
                    label: 'Bluetooth UART Sample',
                    href: '',
                },
            },
        ],
    },
] as Choice[];

const developConfig = [
    {
        ref: 'Hello World',
        sampleSource: 'nrf/applications/serial_lte_modem',
    },
    {
        ref: 'Led and button sample',
        sampleSource: 'nrf/applications/asset_tracker_v2',
    },
    {
        ref: 'Bluetooth UART Sample',
        sampleSource: 'nrf/samples/cellular/nrf_cloud_multi_service',
    },
];

const appsConfig = ['pc-nrfconnect-ble', 'pc-nrfconnect-programmer'];

export default [
    Info(infoConfig),
    Rename(),
    Program(programConfig),
    Empty('Verify'),
    Empty('Evaluate'),
    Empty('Learn'),
    Develop(developConfig),
    Apps(appsConfig),
];
