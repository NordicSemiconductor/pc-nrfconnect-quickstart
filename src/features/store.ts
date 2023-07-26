/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { reducer as choiceReducer } from './choiceSlice';
import { reducer as deviceReducer } from './deviceSlice';

const ifBuiltForDevelopment = <X>(value: X) =>
    process.env.NODE_ENV === 'development' ? value : undefined;

export const rootReducerSpec = {
    device: deviceReducer,
    choice: choiceReducer,
};

const store = configureStore({
    reducer: rootReducerSpec,
    devTools: {
        maxAge: ifBuiltForDevelopment(100),
        serialize: ifBuiltForDevelopment(true),
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export type Thunk<ReturnType = void> = ThunkAction<
    ReturnType,
    State,
    unknown,
    AnyAction
>;

export default store;
