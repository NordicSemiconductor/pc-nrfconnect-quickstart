/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';

import { Choice, Firmware } from '../../features/deviceGuides';
import Program from './Program';
import SelectChoice from './SelectChoice';

export default ({
    back,
    next,
    device,
    selectChoice,
}: {
    back: () => void;
    next: () => void;
    device: Device;
    selectChoice: (choice: Choice) => void;
}) => {
    const [selectedFirmware, setSelectedFirmware] = useState<Firmware[]>();

    return !selectedFirmware ? (
        <SelectChoice
            back={back}
            selectChoice={choice => {
                selectChoice(choice);
                setSelectedFirmware(choice.firmware);
            }}
            device={device}
        />
    ) : (
        <Program
            back={() => setSelectedFirmware(undefined)}
            next={next}
            device={device}
            selectedFirmware={selectedFirmware}
        />
    );
};
