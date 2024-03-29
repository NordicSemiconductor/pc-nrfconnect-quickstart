/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import path from 'path';

import { useAppSelector } from '../../app/store';
import { Back } from '../../common/Back';
import Link from '../../common/Link';
import Main from '../../common/Main';
import { Next } from '../../common/Next';
import { getImageFolder, getStepConfiguration } from '../device/deviceGuides';
import { getSelectedDeviceUnsafely } from '../device/deviceSlice';

const overWriteA = ({
    href,
    children,
}: {
    href?: string;
    children?: React.ReactNode;
}) => <Link color="tw-text-primary" label={children} href={href || ''} />;

const overwriteEm = ({ children }: { children: React.ReactNode }) => (
    <em className="tw-font-light">{children}</em>
);

const overWriteImg = ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} />
);

export default () => {
    const device = useAppSelector(getSelectedDeviceUnsafely);

    return (
        <Main>
            <Main.Content heading={getStepConfiguration('info', device).title}>
                <ReactMarkdown
                    components={{
                        a: overWriteA,
                        em: overwriteEm,
                        img: overWriteImg,
                    }}
                    transformImageUri={src =>
                        src.startsWith('http')
                            ? src
                            : path.join(getImageFolder(), src)
                    }
                >
                    {getStepConfiguration('info', device).markdownContent}
                </ReactMarkdown>
            </Main.Content>
            <Main.Footer>
                <Back />
                <Next />
            </Main.Footer>
        </Main>
    );
};
