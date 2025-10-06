/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { type AppThunk, RootState } from '../../../app/store';
import {
    DeviceWithSerialnumber,
    reset,
} from '../../../features/device/deviceLib';
import {
    getChoiceUnsafely,
    getSelectedDeviceUnsafely,
    selectedDeviceIsConnected,
} from '../../../features/device/deviceSlice';
import jlinkBatch from './actionVariants/jlinkBatch';
import withConnectivityBridge from './actionVariants/withConnectivityBridge';
import {
    prepareProgramming,
    removeError,
    RetryRef,
    setError,
    setProgrammingProgress,
} from './programSlice';

const checkDeviceConnected =
    (): AppThunk<RootState, boolean> => (dispatch, getState) => {
        if (!selectedDeviceIsConnected(getState())) {
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'No development kit detected',
                })
            );
            return false;
        }
        return true;
    };

interface VisibleBatchOperation {
    title: string;
    link?: { label: string; href: string };
}

export interface ActionVariant {
    run: (device: DeviceWithSerialnumber) => Promise<unknown>;
    operations: VisibleBatchOperation[];
}

export const startProgramming = (): AppThunk => (dispatch, getState) => {
    const choice = getChoiceUnsafely(getState());
    dispatch(removeError(undefined));

    let action: ActionVariant;

    switch (choice.type) {
        case 'jlink':
            action = dispatch(jlinkBatch(choice));
            break;
        case 'buttonless-dfu':
            action = dispatch(withConnectivityBridge(choice));
            break;
        default:
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'Unsupported programming choice',
                })
            );
            return;
    }

    dispatch(prepareProgramming(action.operations));

    if (!dispatch(checkDeviceConnected())) return;

    return action.run(getSelectedDeviceUnsafely(getState())).catch(() => {
        if (!getState().steps.program.error) {
            dispatch(
                setError({
                    icon: 'mdi-lightbulb-alert-outline',
                    text: 'Unknown error',
                })
            );
        }
    });
};

export const retry =
    (retryref: RetryRef = 'standard'): AppThunk =>
    dispatch => {
        switch (retryref) {
            case 'reset':
                return dispatch(resetDevice());
            case 'standard':
            default:
                return dispatch(startProgramming());
        }
    };

const resetDevice = (): AppThunk => (dispatch, getState) => {
    if (!dispatch(checkDeviceConnected())) return;

    const device = getSelectedDeviceUnsafely(getState());

    // batchWithProgress should always be filled here
    const batchLength = getState().steps.program.batchWithProgress?.length;
    // length 0 is alse an invalid state
    if (!batchLength) {
        console.error('Could not find valid programming progress batch');
        dispatch(
            setError({
                icon: 'mdi-lightbulb-alert-outline',
                text: 'Program is in invalid state. Please contact support.',
            })
        );
        return;
    }
    dispatch(removeError(undefined));
    const index = batchLength - 1;
    dispatch(
        setProgrammingProgress({
            index,
            progress: 50,
        })
    );

    reset(device)
        .then(() => {
            dispatch(
                setProgrammingProgress({
                    index,
                    progress: 100,
                })
            );
        })
        .catch(() =>
            dispatch(
                setError({
                    icon: 'mdi-restore-alert',
                    text: 'Failed to reset the device',
                    buttonText: 'Reset',
                    retryRef: 'reset',
                })
            )
        );
};
