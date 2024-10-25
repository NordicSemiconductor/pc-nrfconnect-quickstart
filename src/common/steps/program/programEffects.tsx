/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { Progress } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil';
import { NrfutilDeviceLib } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import path from 'path';

import { type AppThunk, RootState } from '../../../app/store';
import { getFirmwareFolder } from '../../../features/device/deviceGuides';
import {
    DeviceWithSerialnumber,
    reset,
} from '../../../features/device/deviceLib';
import type { Firmware } from '../../../features/device/deviceSlice';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../../features/device/deviceSlice';
import {
    prepareProgramming,
    ProgrammingState,
    ResetProgress,
    setProgrammingProgress,
    setProgrammingState,
    setResetProgress,
} from './programSlice';

const checkDeviceConnected =
    (): AppThunk<RootState, boolean> => (_, getState) =>
        selectedDeviceIsConnected(getState());

export const startProgramming = (): AppThunk => (dispatch, getState) => {
    const firmware = getChoiceUnsafely(getState()).firmware;
    dispatch(prepareProgramming(firmware));

    if (!dispatch(checkDeviceConnected())) {
        dispatch(setProgrammingState(ProgrammingState.ERROR));
        return;
    }

    const device = getSelectedDeviceUnsafely(getState());
    program(
        device,
        firmware,
        (index, progress) =>
            dispatch(setProgrammingProgress({ index, progress })),
        resetProgress => dispatch(setResetProgress(resetProgress))
    )
        .then(() => dispatch(setProgrammingState(ProgrammingState.SUCCESS)))
        .catch(() => dispatch(setProgrammingState(ProgrammingState.ERROR)));
};

export const resetDevice = (): AppThunk => (dispatch, getState) => {
    if (!dispatch(checkDeviceConnected())) {
        dispatch(setProgrammingState(ProgrammingState.ERROR));
        return;
    }

    const device = getSelectedDeviceUnsafely(getState());
    dispatch(setResetProgress(ResetProgress.STARTED));
    dispatch(setProgrammingState(ProgrammingState.PROGRAMMING));

    reset(device)
        .then(() => {
            dispatch(setResetProgress(ResetProgress.FINISHED));
            dispatch(setProgrammingState(ProgrammingState.SUCCESS));
        })
        .catch(() => dispatch(setProgrammingState(ProgrammingState.ERROR)));
};

const program = (
    device: DeviceWithSerialnumber,
    firmware: Firmware[],
    onProgress: (index: number, progress: Progress) => void,
    onResetProgress: (resetProgress: ResetProgress) => void
) => {
    const batch = NrfutilDeviceLib.batch();
    batch.recover('Application');
    firmware.forEach(({ file }, index) => {
        batch.program(
            path.join(getFirmwareFolder(), file),
            'Application',
            undefined,
            undefined,
            { onProgress: progress => onProgress(index, progress) }
        );
    });

    batch.reset('Application', 'RESET_SYSTEM', {
        onTaskBegin: () => {
            onResetProgress(ResetProgress.STARTED);
        },
        onTaskEnd: end => {
            if (end.result === 'success') {
                onResetProgress(ResetProgress.FINISHED);
            }
        },
    });

    return batch.run(device);
};
