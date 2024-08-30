/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
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
    title: 'Next level multiprotocol SoC',
    markdownContent:
        'nRF54L15 is the first System-on-Chip (SoC) in the nRF54L Series. It is an ultra-low power Bluetooth 5.4 SoC with a new best-in-class multiprotocol radio and advanced security features.  \n&nbsp;  \nnRF54L Series takes the popular nRF52 Series to the next level with excellent processing power and efficiency, expanded memory, and new peripherals, all in a more compact package.',
};

const programConfig = [
    {
        name: 'Hello World',
        type: 'jlink',
        description: 'Check that UART is working with this sample.',
        documentation: {
            label: 'Hello world',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/hello_world/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf54l15dk_hello_world.hex',
                link: {
                    label: 'Hello world',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/hello_world/README.html',
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
            label: 'Peripheral LBS',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf54l15dk_lbs.hex',
                link: {
                    label: 'Peripheral LBS',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
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
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_uart/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf54l15dk_peripheral_uart.hex',
                link: {
                    label: 'Peripheral UART',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_uart/README.html',
                },
            },
        ],
    },
] as Choice[];

const verifyConfig = [
    {
        ref: 'Hello World',
        config: {
            vComIndex: 1,
            regex: /(\*{3} Booting nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nHello World! nrf54l15pdk@.*\r\n)/,
        },
    },
    {
        ref: 'LED Button Service',
        config: {
            vComIndex: 1,
            regex: /(\*{3} Using nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nStarting Bluetooth Peripheral LBS example)/,
        },
    },
    {
        ref: 'Nordic UART Service',
        config: {
            vComIndex: 1,
            regex: /(\*{3} Using nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nStarting Nordic UART service example)/,
        },
    },
];

const developConfig = [
    {
        ref: 'Hello World',
        sampleSource: 'zephyr/samples/hello_world',
    },
    {
        ref: 'LED Button Service',
        sampleSource: 'nrf/samples/bluetooth/peripheral_lbs',
    },
    {
        ref: 'Nordic UART Service',
        sampleSource: 'nrf/samples/bluetooth/peripheral_uart',
    },
];

const appsConfig = [
    'pc-nrfconnect-ble',
    'pc-nrfconnect-programmer',
    'pc-nrfconnect-serial-terminal',
    'pc-nrfconnect-dtm',
];

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
