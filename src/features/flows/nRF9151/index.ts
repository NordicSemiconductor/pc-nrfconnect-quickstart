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
import { Choice } from '../../../common/steps/program/programSlice';
import Rename from '../../../common/steps/Rename';
import CustomEvaluate from './Evaluate';
import SIM from './SIM';

const infoConfig = {
    title: 'Massive IoT Powerhouse',
    markdownContent:
        "![nRF9151 DK](9151DK.png)  \n&nbsp;  \nThe nRF9151 Development Kit is perfect for evaluating the nRF9151 SiP and developing cellular IoT or DECT NR+ applications.  \n&nbsp;  \nIt includes SEGGER's J-Link OB debug probe and all the necessary external circuitry, like (e)SIM interface, antennas, access to all IO pins, programmable buttons, and module interfaces.  \n&nbsp;  \n[Hardware documentation](https://docs.nordicsemi.com/bundle/ug_nrf9151_dk/page/UG/nrf91_DK/intro.html)  \n&nbsp;  \n![nRF9151 SiP Cores](9151Cores.png)  \nYou have two options for leveraging the nRF9151 SiP:  \n&nbsp;  \n**Option 1** *Recommended*  \nHarness the full potential of nRF9151 by using the entire application core for your code, eliminating the need for an external MCU, and fully capitalizing on the advantages offered by nRF9151.  \n&nbsp;  \n**Option 2**  \nIntegrate nRF9151 as a [cellular](https://www.nordicsemi.com/Products/Low-power-cellular-IoT/What-is-cellular-IoT#infotabs) or [NR+](https://www.nordicsemi.com/Products/DECT-NR) modem alongside your existing design running a serial AT command set on the application core.",
};

const programConfig = [
    {
        name: 'AT Commands',
        type: 'jlink',
        description: 'Evaluate the cellular modem using AT commands.',
        documentation: {
            label: 'Serial LTE Modem',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/README.html',
        },
        firmwareNote: {
            title: 'Increased power consumption',
            content:
                'Modem Trace is enabled; the current consumption will be higher than usual.',
        },
        firmware: [
            {
                core: 'Modem',
                file: 'mfw_nrf91x1_2.0.1.zip',
                link: {
                    label: 'Firmware v2.0.1',
                    href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf91x1-sip/nrf91x1-lte-modem-firmware/release-notes/mfw_nrf91x1_2.0.1_release_notes.txt',
                },
            },
            {
                core: 'Application',
                file: 'nrf9151dk_serial_lte_modem_debug_2024-07-04_20471118.hex',
                link: {
                    label: 'Serial LTE Modem',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/README.html',
                },
            },
        ],
    },
    {
        name: 'Asset Tracking',
        type: 'jlink',
        description:
            'Evaluate cloud interaction, location services, GNSS, and real-time configurations.',
        documentation: {
            label: 'Asset Tracker v2',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/asset_tracker_v2/README.html',
        },
        firmwareNote: {
            title: 'Increased power consumption',
            content:
                'Modem Trace is enabled; the current consumption will be higher than usual.',
        },
        firmware: [
            {
                core: 'Modem',
                file: 'mfw_nrf91x1_2.0.1.zip',
                link: {
                    label: 'Firmware v2.0.1',
                    href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf91x1-sip/nrf91x1-lte-modem-firmware/release-notes/mfw_nrf91x1_2.0.1_release_notes.txt',
                },
            },
            {
                core: 'Application',
                file: 'nrf9151dk_asset_tracker_v2_debug_2024-07-04_20471118.hex',
                link: {
                    label: 'Asset Tracker v2',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/asset_tracker_v2/README.html',
                },
            },
        ],
    },
    {
        name: 'nRF Cloud multi-service',
        type: 'jlink',
        description:
            'Evaluate nRF Cloud services: onboarding, data collection, FOTA updates, location, logging, and alerts.',
        documentation: {
            label: 'nRF Cloud multi-service',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/nrf_cloud_multi_service/README.html',
        },
        firmwareNote: {
            title: 'Increased power consumption',
            content:
                'Modem Trace is enabled; the current consumption will be higher than usual.',
        },
        firmware: [
            {
                core: 'Modem',
                file: 'mfw_nrf91x1_2.0.1.zip',
                link: {
                    label: 'Firmware v2.0.1',
                    href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf91x1-sip/nrf91x1-lte-modem-firmware/release-notes/mfw_nrf91x1_2.0.1_release_notes.txt',
                },
            },
            {
                core: 'Application',
                file: 'nrf9151dk_nrfcloud_multi_service_coap_debug_2024-07-04_20471118.hex',
                link: {
                    label: 'nRF Cloud multi-service',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/nrf_cloud_multi_service/README.html',
                },
            },
        ],
    },
    {
        name: 'Shell Command Line Interface',
        type: 'jlink',
        description: 'Evaluate throughput, connectivity, and more.',
        documentation: {
            label: 'Modem Shell',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html',
        },
        firmwareNote: {
            title: 'Increased power consumption',
            content:
                'Modem Trace is enabled; the current consumption will be higher than usual.',
        },
        firmware: [
            {
                core: 'Modem',
                file: 'mfw_nrf91x1_2.0.1.zip',
                link: {
                    label: 'Firmware v2.0.1',
                    href: 'https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf91x1-sip/nrf91x1-lte-modem-firmware/release-notes/mfw_nrf91x1_2.0.1_release_notes.txt',
                },
            },
            {
                core: 'Application',
                file: 'nrf9151dk_modem_shell_debug_2024-07-04_20471118.hex',
                link: {
                    label: 'Modem Shell',
                    href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/cellular/modem_shell/README.html',
                },
            },
        ],
    },
] as Choice[];

const verificationConfig = {
    settings: [
        {
            ref: 'AT Commands',
            vComIndex: 0,
            mode: 'LINE' as const,
        },
        {
            ref: 'Asset Tracking',
            vComIndex: 0,
            mode: 'LINE' as const,
        },
        {
            ref: 'nRF Cloud multi-service',
            vComIndex: 0,
            mode: 'SHELL' as const,
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

const evaluationConfig = [
    {
        ref: 'AT Commands',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description:
                    'Use the Serial Terminal desktop application as a serial interface to send AT commands to the device',
                vComIndex: 0,
                links: [
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
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
            },
        ],
    },
    {
        ref: 'Asset Tracking',
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
        ref: 'nRF Cloud multi-service',
        component: CustomEvaluate,
    },
    {
        ref: 'Shell Command Line Interface',
        resources: [
            {
                app: 'pc-nrfconnect-serial-terminal',
                description: 'Serial interface to send commands to the device.',
                vComIndex: 0,
                supplemetaryLinks: [
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
            {
                app: 'pc-nrfconnect-cellularmonitor',
                description: 'Automatically connect and evaluate parameters.',
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
        label: 'Developing with nRF91 Series',
        description:
            'Device-specific information on working with nRF91 Series devices.',
        link: {
            label: 'Developing with nRF91 Series',
            href: 'https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/app_dev/device_guides/nrf91/index.html',
        },
    },
];

const developConfig = [
    {
        ref: 'AT Commands',
        sampleSource: 'nrf/applications/serial_lte_modem',
    },
    {
        ref: 'Asset Tracking',
        sampleSource: 'nrf/applications/asset_tracker_v2',
    },
    {
        ref: 'nRF Cloud multi-service',
        sampleSource: 'nrf/samples/cellular/nrf_cloud_multi_service',
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

export default [
    Info(infoConfig),
    Rename(),
    Program(programConfig),
    Verify(verificationConfig),
    SIM(),
    Evaluate(evaluationConfig),
    Learn(learnConfig),
    Develop(developConfig),
    Apps(appsConfig),
];
