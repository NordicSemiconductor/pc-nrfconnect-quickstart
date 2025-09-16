/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import Verify from '../../../common/steps/91FamilyVerify';
import Apps from '../../../common/steps/Apps';
import Develop from '../../../common/steps/develop';
import Evaluate from '../../../common/steps/Evaluate';
import Info from '../../../common/steps/Info';
import Learn from '../../../common/steps/Learn';
import Program from '../../../common/steps/program';
import Rename from '../../../common/steps/Rename';
import { Choice } from '../../device/deviceSlice';
import SIM from './SIM';

const infoConfig = {
    title: 'Massive IoT Powerhouse',
    markdownContent:
        '![Thingy:91 X](Thingy91X.png)  \n&nbsp;  \nThe Nordic Thingy:91 X Prototyping Platform is perfect for running Cellular IoT or DECT NR+ prototypes.  \n&nbsp;  \nIt includes an nRF9151 SiP, an nRF7002 (Wi-Fi IC), an nRF5340 (short range IC), and all the necessary external circuirty like (e)SIM interface, antennas, programmable button and LEDs, and module interfaces.  \n&nbsp;  \n[Hardware documentation](https://docs.nordicsemi.com/category/nrf-91-series)  \n&nbsp;  \n![9151 Cores](9151Cores.png)  \nYou have two options for leveraging the nRF9151 SiP:  \n&nbsp;  \n**Option 1** *Recommended*  \nHarness the full potential of nRF9151 by using the entire application core for your code, eliminating the need for an external MCU, and fully capitalizing on the advantages offered by nRF9151.  \n&nbsp;  \n**Option 2**  \nIntegrate nRF9151 as a [cellular](https://www.nordicsemi.com/Products/Low-power-cellular-IoT/What-is-cellular-IoT#infotabs) or [NR+](https://www.nordicsemi.com/Products/DECT-NR) modem alongside your existing design running a serial AT command set on the application core.',
};

const programConfig = [
    {
        name: 'Start testing',
        type: 'buttonless-dfu',
        description:
            'Connect to hello.nrfcloud.com to retrieve real-time data and do simple testing.',
        documentation: {
            label: 'Hello nRF Cloud',
            href: 'https://hello-nrfcloud.github.io/firmware/html/index.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'thingy91x_hello.nrfcloud.zip',
                link: {
                    label: 'Hello nRF Cloud',
                    href: 'https://hello-nrfcloud.github.io/firmware/html/index.html',
                },
            },
        ],
    },
    {
        name: 'Asset Tracker',
        type: 'buttonless-dfu',
        description:
            'Enable cloud-connected, battery-efficient asset tracking and sensor data collection with customizable, power-optimized features.',
        documentation: {
            label: 'Asset Tracker Template',
            href: 'https://docs.nordicsemi.com/bundle/asset-tracker-template-latest/page/index.html',
        },
        firmwareNote: {
            title: 'Increased power consumption',
            content:
                'Modem Trace is enabled; the current consumption will be higher than usual.',
        },
        firmware: [
            {
                core: 'Application',
                file: 'thingy91x_asset_tracker_template.zip',
                link: {
                    label: 'Asset Tracker Template',
                    href: 'https://docs.nordicsemi.com/bundle/asset-tracker-template-latest/page/index.html',
                },
            },
        ],
    },
    {
        name: 'AT Commands',
        type: 'buttonless-dfu',
        description: 'Evaluate the cellular modem using AT commands.',
        documentation: {
            label: 'Serial LTE Modem',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'thingy91x_serial_lte_modem.zip',
                link: {
                    label: 'Serial LTE Modem',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/README.html',
                },
            },
        ],
    },
    {
        name: 'Shell Command Line Interface',
        type: 'buttonless-dfu',
        description: 'Evaluate throughput, connectivity, and more.',
        documentation: {
            label: 'Modem Shell',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html',
        },
        firmware: [
            {
                core: 'Application',
                file: 'thingy91x_modem_shell.zip',
                link: {
                    label: 'Modem Shell',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html',
                },
            },
        ],
    },
] as Choice[];

const verifyConfig = {
    settings: [
        {
            ref: 'Start testing',
            vComIndex: 0,
            mode: 'SHELL' as const,
        },
        {
            ref: 'Asset Tracker',
            vComIndex: 0,
            mode: 'SHELL' as const,
        },
        {
            ref: 'AT Commands',
            vComIndex: 0,
            mode: 'LINE' as const,
        },
        {
            ref: 'Shell Command Line Interface',
            vComIndex: 0,
            mode: 'SHELL' as const,
        },
    ],
    commands: [
        {
            title: 'Manufacturer',
            command: 'AT+CGMI',
            responseRegex: '(.*)',
        },
        {
            title: 'Hardware version',
            command: 'AT%HWVERSION',
            responseRegex: '%HWVERSION: (.*)',
        },
        {
            title: 'International Mobile Equipment Identity',
            command: 'AT+CGSN=1',
            responseRegex: '\\+CGSN: "(.*)"',
            copiable: true,
        },
    ],
};

const evaluateConfig = [
    {
        ref: 'Start testing',
        resources: [
            {
                title: 'Discover the features',
                mainLink: {
                    label: 'Open web interface',
                    href: 'https://hello.nrfcloud.com/',
                },
                description:
                    'Scan the QR code or fill in the fingerprint to access your device.',
            },
            {
                app: 'pc-nrfconnect-serial-terminal',
                description: 'Serial interface to send commands to the device.',
                vComIndex: 0,
                supplementaryLinks: [
                    {
                        label: 'Modem shell commands',
                        href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html#overview',
                    },
                    {
                        label: 'AT Commands reference manual',
                        href: 'https://docs.nordicsemi.com/bundle/ref_at_commands_nrf91x1/page/REF/at_commands/intro_nrf91x1.html',
                    },
                ],
            },
        ],
    },
    {
        ref: 'Asset Tracker',
        resources: [
            {
                title: 'Cellular IoT Fundamentals',
                mainLink: {
                    label: 'Open course',
                    href: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/lessons/lesson-1-cellular-fundamentals/topic/lesson-1-exercise-1/',
                },
                description:
                    'Follow Exercise 1 in the Cellular IoT Fundamentals course to evaluate cloud connectivity.',
            },
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
            },
        ],
    },
    {
        ref: 'AT Commands',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description:
                    'Use the Serial Terminal PC application as a serial interface to send AT commands to the device.',
                vComIndex: 0,
                supplementaryLinks: [
                    {
                        label: 'AT Commands reference manual',
                        href: 'https://docs.nordicsemi.com/bundle/ref_at_commands_nrf91x1/page/REF/at_commands/intro_nrf91x1.html',
                    },
                    {
                        label: 'IP AT Commands Documentation',
                        href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/doc/AT_commands.html',
                    },
                ],
            },
        ],
    },
    {
        ref: 'Shell Command Line Interface',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description: 'Serial interface to send commands to the device.',
                vComIndex: 0,
                supplementaryLinks: [
                    {
                        label: 'Modem shell commands',
                        href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html#overview',
                    },
                    {
                        label: 'AT Commands reference manual',
                        href: 'https://docs.nordicsemi.com/bundle/ref_at_commands_nrf91x1/page/REF/at_commands/intro_nrf91x1.html',
                    },
                ],
            },
        ],
    },
];

const learnConfig = [
    {
        label: 'Developer Academy',
        description: 'Interactive online learning platform for Nordic devices.',
        link: {
            label: 'Nordic Developer Academy',
            href: 'https://academy.nordicsemi.com/',
        },
    },
    {
        label: 'Best practices',
        description:
            'The main aspects and decisions you need to consider before and during the development phase of a low-power cellular Internet of Things product.',
        link: {
            label: 'nWP044 - Best practices for cellular IoT development',
            href: 'https://docs.nordicsemi.com/bundle/nwp_044/page/WP/nwp_044/intro.html',
        },
    },
];

const developConfig = [
    // Not in NCS
    // {
    //     ref: 'Start testing',
    //     sampleSource: 'Unknown',
    // },
    {
        ref: 'Asset Tracker',
        sampleSource: 'nrf/applications/asset_tracker_template',
    },
    {
        ref: 'AT Commands',
        sampleSource: 'nrf/applications/serial_lte_modem',
    },
    {
        ref: 'Shell Command Line Interface',
        sampleSource: 'nrf/samples/cellular/modem_shell',
    },
];

const appsConfig = [
    'pc-nrfconnect-cellularmonitor',
    'pc-nrfconnect-serial-terminal',
    'pc-nrfconnect-programmer',
    'pc-nrfconnect-ppk',
];

export default {
    device: 'Nordic Thingy:91 X',
    flow: [
        Info(infoConfig),
        Rename(),
        Program(programConfig),
        Verify(verifyConfig),
        SIM(),
        Evaluate(evaluateConfig),
        Learn(learnConfig),
        Develop(developConfig),
        Apps(appsConfig),
    ],
};
