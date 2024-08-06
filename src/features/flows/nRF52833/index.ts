/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import Verify from '../../../common/steps/5xFamilyVerify';
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
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/zephyr/samples/hello_world/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52833dk_hello_world.hex',
                link: {
                    label: 'Hello world',
                    href: '',
                },
            },
        ],
    },
    {
        name: 'LED Button Service',
        type: 'jlink',
        description:
            "Check that the LED's and buttons on the DK are working with this sample.",
        documentation: {
            label: 'LBS',
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52833dk_lbs.hex',
                link: {
                    label: 'Led and button sample',
                    href: '',
                },
            },
        ],
    },
    {
        name: 'Nordic UART Service',
        type: 'jlink',
        description: 'Check that UART over BLE is working.',
        documentation: {
            label: 'Peripheral UART',
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_uart/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52833dk_peripheral_uart.hex',
                link: {
                    label: 'Bluetooth UART Sample',
                    href: '',
                },
            },
        ],
    },
] as Choice[];

const verifyConfig = [
    {
        ref: 'Hello World',
        config: {
            vComIndex: 0,
            regex: /(\*{3} Booting nRF Connect SDK .* \*{3}\r\nHello World! nrf52833dk_nrf52833)/,
        },
    },
    {
        ref: 'LED Button Service',
        config: {
            vComIndex: 0,
            regex: /(\*{3} Booting nRF Connect SDK .* \*{3}\r\nStarting Bluetooth Peripheral LBS example)/,
        },
    },
    {
        ref: 'Nordic UART Service',
        config: {
            vComIndex: 0,
            regex: /(\*{3} Booting nRF Connect SDK .* \*{3}\r\nStarting Nordic UART service example)/,
        },
    },
];

const developConfig = [
    {
        ref: 'Hello World',
        sampleSource: 'nrf/applications/serial_lte_modem',
    },
    {
        ref: 'LED Button Service',
        sampleSource: 'nrf/applications/asset_tracker_v2',
    },
    {
        ref: 'Nordic UART Service',
        sampleSource: 'nrf/samples/cellular/nrf_cloud_multi_service',
    },
];

const appsConfig = ['pc-nrfconnect-ble', 'pc-nrfconnect-programmer'];

export default [
    Info(infoConfig),
    Rename(),
    Program(programConfig),
    Verify(verifyConfig),
    Empty('Evaluate'),
    Empty('Learn'),
    Develop(developConfig),
    Apps(appsConfig),
];
