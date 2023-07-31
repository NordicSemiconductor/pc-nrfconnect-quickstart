/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { getCurrentWindow } from '@electron/remote';
import { Device } from '@nordicsemiconductor/nrf-device-lib-js';
import { ipcRenderer } from 'electron';
import { ErrorBoundary, openAppWindow } from 'pc-nrfconnect-shared';

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
    getConnectedDevices,
    getSelectedDevice,
    removeDevice,
    setSelectedDevice,
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

interface SharedProps {
    device?: Device;
    back: () => void;
    next: () => void;
    quit: () => void;
    openLauncher: () => void;
    openApp: (app: string, serialNumber?: string) => void;
}

interface SharedPropsWithDevice extends SharedProps {
    device: Device;
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

    const props: SharedProps = {
        device: selectedDevice,
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
        openApp: (app: string, serialNumber?: string) => {
            openAppWindow(
                { name: app, source: 'official' },
                serialNumber ? { device: { serialNumber } } : undefined
            );
        },
    };

    return (
        <>
            {currentStep === Steps.WELCOME && <Welcome {...props} />}
            {currentStep === Steps.CONNECT && (
                <Connect
                    {...props}
                    next={(device: Device) => {
                        dispatch(setSelectedDevice(device));
                        props.next();
                    }}
                />
            )}
            {selectedDevice && (
                <>
                    {currentStep === Steps.INTRODUCTION && (
                        <Introduction {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.PERSONALIZE && (
                        <Personalize {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.EVALUATE && (
                        <Evaluate {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.PROGRAM && (
                        <Program {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.APPS && (
                        <Apps {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.LEARN && (
                        <Learn {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.DEVELOP && (
                        <Develop {...(props as SharedPropsWithDevice)} />
                    )}
                    {currentStep === Steps.FINISH && (
                        <Finish {...(props as SharedPropsWithDevice)} />
                    )}
                </>
            )}
        </>
    );
};

const ConnectedToErrorBoundary: React.FC = ({ children }) => {
    const connectedDevices = useSelector(getConnectedDevices);
    const selectedDevice = useSelector(getSelectedDevice);

    return (
        <ErrorBoundary
            devices={connectedDevices}
            selectedDevice={selectedDevice}
            selectedSerialNumber={selectedDevice?.serialNumber}
        >
            {children}
        </ErrorBoundary>
    );
};

const ConnectedToStore: React.FC = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

export default () => (
    <ConnectedToStore>
        <ConnectedToErrorBoundary>
            <App />
        </ConnectedToErrorBoundary>
    </ConnectedToStore>
);
