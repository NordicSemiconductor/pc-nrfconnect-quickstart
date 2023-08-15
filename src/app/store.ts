/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';

import device from '../features/device/deviceSlice';
import program from '../features/steps/program/programSlice';
import steps from '../features/steps/stepsSlice';

const ifBuiltForDevelopment = <X>(value: X) =>
    process.env.NODE_ENV === 'development' ? value : undefined;

export const store = configureStore({
    reducer: { device, steps, program },
    devTools: {
        maxAge: ifBuiltForDevelopment(100),
        serialize: ifBuiltForDevelopment(true),
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<AppLayout = RootState, ReturnType = void> = ThunkAction<
    ReturnType,
    AppLayout,
    unknown,
    AnyAction
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
