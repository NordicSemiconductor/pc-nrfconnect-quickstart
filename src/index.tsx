/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { openAppWindow } from 'pc-nrfconnect-shared';

import Apps from './components/Apps';
import Connect from './components/Connect';
import Develop from './components/Develop';
import Evaluate from './components/Evaluate';
import Finish from './components/Finish';
import Introduction from './components/Introduction';
import Learn from './components/Learn';
import Personalize from './components/Personalize';
import Program from './components/Program';
import Welcome from './components/Welcome';
import { watchDevices } from './features/deviceLib';
import {
    addDevice,
    getSelectedDevice,
    removeDevice,
} from './features/deviceSlice';
import store, { Dispatch } from './features/store';

import './index.scss';

enum Steps {
    WELCOME,
    CONNECT,
    INTRODUCTION,
    PERSONALIZE,
    EVALUATE,
    PROGRAM,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

const App = () => {
    const dispatch = useDispatch<Dispatch>();
    const selectedDevice = useSelector(getSelectedDevice);
    const [currentStep, setCurrentStep] = useState(
        process.argv.includes('--first-launch') ? Steps.WELCOME : Steps.CONNECT
    );

    useEffect(() => {
        const cleanup = watchDevices(
            newDevice => {
                dispatch(addDevice(newDevice));
            },
            deviceId => {
                dispatch(removeDevice(deviceId));
            }
        );

        return () => {
            cleanup.then(cb => cb());
        };
    }, [selectedDevice, dispatch]);

    const props = {
        back: () => {
            if (currentStep === Steps.APPS) {
                setCurrentStep(Steps.EVALUATE);
            } else {
                setCurrentStep(Math.max(Steps.WELCOME, currentStep - 1));
            }
        },
        next: () => {
            setCurrentStep(Math.min(Steps.FINISH, currentStep + 1));
        },
        quit: () => {
            getCurrentWindow().close();
        },
        openLauncher: () => {
            ipcRenderer.send('open-app-launcher');
        },
        openApp: (app: string) => {
            openAppWindow({ name: app, source: 'official' });
        },
    };

    return (
        <>
            {currentStep === Steps.WELCOME && <Welcome {...props} />}
            {currentStep === Steps.CONNECT && <Connect {...props} />}
            {currentStep === Steps.INTRODUCTION && <Introduction {...props} />}
            {currentStep === Steps.PERSONALIZE && <Personalize {...props} />}
            {currentStep === Steps.EVALUATE && <Evaluate {...props} />}
            {currentStep === Steps.PROGRAM && <Program {...props} />}
            {currentStep === Steps.APPS && <Apps {...props} />}
            {currentStep === Steps.LEARN && <Learn {...props} />}
            {currentStep === Steps.DEVELOP && <Develop {...props} />}
            {currentStep === Steps.FINISH && <Finish {...props} />}
        </>
    );
};
export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);
