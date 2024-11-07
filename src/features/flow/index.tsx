/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useMemo } from 'react';
import {
    deviceInfo,
    logger,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { allReset } from '../../common/steps/stepReducers';
import { getSelectedDevice } from '../device/deviceSlice';
import type { Flow } from '../flows';
import flows from '../flows';
import { allReset as flowsAllReset } from '../flows/reducers';
import Connect from './connect';
import Finish from './finish';
import FlowProgress from './FlowProgress';
import {
    getCurrentStepIndex,
    getFlow,
    isConnectVisible,
    setFlow,
} from './flowSlice';

const useLogSteps = () => {
    const currentStepIndex = useAppSelector(getCurrentStepIndex);
    const flow = useAppSelector(getFlow);

    // Telemetry when user changes step
    useEffect(() => {
        const step = flow[currentStepIndex] || 'Connect';

        logger.debug(`Changed step: ${step}`);
        telemetry.sendEvent('Changed step', { step });
    }, [flow, currentStepIndex]);
};

const Flow = ({ flow }: { flow: Flow[] }) => {
    const dispatch = useAppDispatch();
    const currentStepIndex = useAppSelector(getCurrentStepIndex);
    const flowWithFinish = useMemo(() => [...flow, Finish()], [flow]);

    useEffect(() => {
        dispatch(allReset());
        dispatch(flowsAllReset());
        dispatch(setFlow(flowWithFinish.map(f => f.name)));
    }, [flowWithFinish, dispatch]);

    const Step =
        currentStepIndex >= 0
            ? flowWithFinish[currentStepIndex].component
            : undefined;

    return Step ? <Step /> : null;
};

export default () => {
    const showConnect = useAppSelector(isConnectVisible);
    const device = useAppSelector(getSelectedDevice);
    const deviceName = device && deviceInfo(device).name;
    const validFlow = deviceName && !!flows[deviceName];

    useLogSteps();

    return (
        <>
            <FlowProgress />
            <div className="tw-flex-1">
                {validFlow && !showConnect ? (
                    <Flow flow={flows[deviceName]} />
                ) : (
                    <Connect />
                )}
            </div>
        </>
    );
};
