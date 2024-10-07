/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
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
    title: 'Versatile single-board development kit',
    markdownContent:
        '![nRF52840 DK](52840DK.png)  \n&nbsp;  \nThe nRF52840 DK is a versatile single-board development kit for Bluetooth Low Energy, Bluetooth Mesh, Matter, Thread, Zigbee, 802.15.4, ANT and 2.4 GHz proprietary applications on the nRF52840 SoC. It is the recommended Nordic development kit for Amazon Sidewalk. It also supports development on the nRF52811 SoC.  \n&nbsp;  \n&nbsp;  \n![Technologies](52840DKTech.png)  \n&nbsp;  \nThe nRF52840 DK can be used for Matter over Thread where Thread is used for transport and Bluetooth LE for commissioning. Matter devices based on Thread are required to feature Bluetooth LE concurrently to enable adding new devices to a network.  \n&nbsp;  \n[Hardware documentation](https://docs.nordicsemi.com/bundle/ug_nrf52840_dk/page/UG/dk/intro.html)',
};

const programConfig = [
    {
        name: 'Hello World',
        type: 'jlink',
        description: 'Check that UART is working with this sample.',
        documentation: {
            label: 'Hello World',
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/zephyr/samples/hello_world/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52840dk_hello_world.hex',
                link: {
                    label: 'Hello World',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/zephyr/samples/hello_world/README.html',
                },
            },
        ],
    },
    {
        name: 'Peripheral LED Button Service',
        type: 'jlink',
        description:
            'Check that the LEDs and buttons on the DK are working with this sample.',
        documentation: {
            label: 'Peripheral LBS',
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52840dk_lbs.hex',
                link: {
                    label: 'Peripheral LBS',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_lbs/README.html',
                },
            },
        ],
    },
    {
        name: 'Peripheral UART Service',
        type: 'jlink',
        description: 'Check that UART over Bluetooth® LE is working.',
        documentation: {
            label: 'Peripheral UART Service',
            href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_uart/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'nrf52840dk_peripheral_uart.hex',
                link: {
                    label: 'Peripheral UART Service',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-2.7.0/page/nrf/samples/bluetooth/peripheral_uart/README.html',
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
            regex: /(\*{3} Booting nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nHello World! nrf52840dk\/nrf52840)/,
        },
    },
    {
        ref: 'Peripheral LED Button Service',
        config: {
            vComIndex: 0,
            regex: /(\*{3} Using nRF Connect SDK .* \*{3}\r\n\*{3} Using Zephyr OS .* \*{3}\r\nStarting Bluetooth Peripheral LBS example)/,
        },
    },
    {
        ref: 'Peripheral UART Service',
        config: {
            vComIndex: 0,
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
                vComIndex: 0,
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
            'Get the know-how to build wireless products using Nordic Semiconductor solutions',
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
        label: 'Developing with nRF52 Series',
        description:
            'Device-specific information about features, DFU solution, and development.',
        link: {
            label: 'Developing with nRF52 Series',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev/device_guides/nrf52/index.html',
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