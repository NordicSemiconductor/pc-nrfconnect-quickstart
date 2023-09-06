/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useAppDispatch, useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Link from '../../common/Link';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { deviceDescription } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely, selectDevice } from '../device/deviceSlice';

const overWriteA = ({
    href,
    children,
}: {
    href?: string;
    children?: React.ReactNode;
}) => <Link color="tw-text-primary" label={children} href={href || ''} />;

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);
    const dispatch = useAppDispatch();
    const [currentSubStepIndex, setCurrentSubStepIndex] = useState(
            ? 0
    );

    return (
        <Main>
            <Main.Content
                heading={deviceDescription(device)[currentSubStepIndex].title}
            >
                <ReactMarkdown
                    components={{
                        a: overWriteA,
                    }}
                >
                    {
                        deviceDescription(device)[currentSubStepIndex]
                            .markdownContent
                    }
                </ReactMarkdown>
            </Main.Content>
            <Main.Footer>
                <Back
                    onClick={back => {
                        if (currentSubStepIndex > 0) {
                            setCurrentSubStepIndex(currentSubStepIndex - 1);
                        } else {
                            dispatch(selectDevice(undefined));
                            back();
                        }
                    }}
                />
                <Next
                    onClick={next => {
                        if (
                            currentSubStepIndex <
                            deviceDescription(device).length - 1
                        ) {
                            setCurrentSubStepIndex(currentSubStepIndex + 1);
                        } else {
                            next();
                        }
                    }}
                />
            </Main.Footer>
        </Main>
    );
};
