/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

enum Step {
    WELCOME,
    CONNECT,
    INTRODUCTION,
    PERSONALIZE,
    SELECT_FIRMWARE,
    PROGRAM,
    APPS,
    LEARN,
    DEVELOP,
    FINISH,
}

export type StepWithoutDevice = Step.WELCOME | Step.CONNECT;
export type StepWithDevice =
    | Step.INTRODUCTION
    | Step.PERSONALIZE
    | Step.SELECT_FIRMWARE;
export type StepWithDeviceAndChoice =
    | Step.PROGRAM
    | Step.APPS
    | Step.LEARN
    | Step.DEVELOP
    | Step.FINISH;

export const initialStep = process.argv.includes('--first-launch')
    ? Step.WELCOME
    : Step.CONNECT;

export const skipOnBackwardNavigation = (step: Step) => step === Step.PROGRAM;

export default Step;
