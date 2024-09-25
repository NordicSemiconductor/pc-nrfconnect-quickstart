/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import Verify from '../../../common/steps/5xFamilyVerify';
import Apps from '../../../common/steps/Apps';
import Develop from '../../../common/steps/develop';
import Evaluate from '../../../common/steps/Evaluate';
import Info from '../../../common/steps/Info';
import Learn from '../../../common/steps/Learn';
import Program from '../../../common/steps/program';
import { Choice } from '../../../common/steps/program/programSlice';
import Rename from '../../../common/steps/Rename';

const infoConfig = {
    title: 'Next-level multiprotocol SoC',
    markdownContent:
        '![nRF54L15 DK](54L15DK.png)  \n&nbsp;  \nnRF54L15 is the first System-on-Chip (SoC) in the nRF54L Series. It is an ultra-low power Bluetooth 5.4 SoC with a new best-in-class multiprotocol radio and advanced security features.  \n&nbsp;  \nThe nRF54L Series takes the popular nRF52 Series to the next level with excellent processing power and efficiency, expanded memory, and new peripherals, all in a more compact package.',
};

const programConfig = [
    {
        name: 'Hello World',
        type: 'jlink',
        description: 'Program to check that UART on this DK is working.',
        documentation: {
            label: 'Hello World',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/hello_world/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf54l15dk_hello_world.hex',
                link: {
                    label: 'Hello World',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/hello_world/README.html',
                },
            },
        ],
    },
    {
        name: 'Peripheral LED Button Service',
        type: 'jlink',
        description:
            'Program to check that the LEDs and buttons on the DK are working.',
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
        name: 'Peripheral UART Service',
        type: 'jlink',
        description: 'Program to check that UART over Bluetooth LE is working.',
        documentation: {
            label: 'Peripheral UART Service',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_uart/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf54l15dk_peripheral_uart.hex',
                link: {
                    label: 'Peripheral UART Service',
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
        ref: 'Peripheral LED Button Service',
        config: {
            vComIndex: 1,
            regex: /(\*{3} Using nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nStarting Bluetooth Peripheral LBS example)/,
        },
    },
    {
        ref: 'Peripheral UART Service',
        config: {
            vComIndex: 1,
            regex: /(\*{3} Using nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nStarting Nordic UART service example)/,
        },
    },
];

const evaluateConfig = [
    {
        ref: 'Hello World',
        resources: [
            {
                title: 'Test the sample',
                description:
                    'Open the nRF Connect Serial terminal application and press reset on the device to print the output.',
                app: 'pc-nrfconnect-serial-terminal',
                vComIndex: 1,
            },
            {
                title: 'Documentation',
                description: 'Read the complete documentation for the sample.',
                mainLink: {
                    label: 'Open documentation',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/hello_world/README.html',
                },
            },
        ],
    },
    {
        ref: 'Peripheral LED Button Service',
        resources: [
            {
                title: 'Test the sample',
                description: 'Follow the testing steps to evaluate the sample.',
                mainLink: {
                    label: 'Testing steps',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_lbs/README.html#testing',
                },
            },
            {
                title: 'Documentation',
                description: 'Read the complete documentation for the sample.',
                mainLink: {
                    label: 'Open documentation',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
                },
            },
        ],
    },
    {
        ref: 'Peripheral UART Service',
        resources: [
            {
                title: 'Test the sample',
                description:
                    'Follow the testing steps instructions to evaluate the sample.',
                mainLink: {
                    label: 'Testing steps',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_uart/README.html#testing',
                },
            },
            {
                title: 'Documentation',
                description: 'Read the complete documentation for the sample.',
                mainLink: {
                    label: 'Open documentation',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/peripheral_uart/README.html',
                },
            },
        ],
    },
];

const learnConfig = [
    {
        label: 'Developer Academy',
        description:
            'Speed up your wireless IoT learning journey with Nordic devices.',
        link: {
            label: 'Nordic Developer Academy',
            href: 'https://academy.nordicsemi.com/',
        },
    },
    {
        label: 'nRF Connect SDK and Zephyr',
        description:
            'Learn about the application development in the nRF Connect SDK and Zephyr.',
        link: {
            label: 'Application development',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev.html',
        },
    },
    {
        label: 'Developing with nRF54L Series',
        description:
            'Device-specific information about features, DFU solution, development and much more.',
        link: {
            label: 'Developing with nRF54L Series',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev/device_guides/nrf54l.html',
        },
    },
];

const developConfig = [
    {
        ref: 'Hello World',
        sampleSource: 'zephyr/samples/hello_world',
    },
    {
        ref: 'Peripheral LED Button Service',
        sampleSource: 'nrf/samples/bluetooth/peripheral_lbs',
    },
    {
        ref: 'Peripheral UART Service',
        sampleSource: 'nrf/samples/bluetooth/peripheral_uart',
    },
];

const appsConfig = [
    'pc-nrfconnect-programmer',
    'pc-nrfconnect-serial-terminal',
    'pc-nrfconnect-board-configurator',
    'pc-nrfconnect-dtm',
];

export default [
    Info(infoConfig),
    Rename(),
    Program(programConfig),
    Verify(verifyConfig),
    Evaluate(evaluateConfig),
    Learn(learnConfig),
    Develop(developConfig),
    Apps(appsConfig),
];
