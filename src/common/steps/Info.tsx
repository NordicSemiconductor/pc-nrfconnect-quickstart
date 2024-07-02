/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import path from 'path';

import { getImageFolder } from '../../features/device/deviceGuides';
import { Back } from '../Back';
import Link from '../Link';
import Main from '../Main';
import { Next } from '../Next';

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

interface Props {
    title: string;
    markdownContent: string;
}

const InfoStep = ({ title, markdownContent }: Props) => (
    <Main>
        <Main.Content heading={title}>
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
                {markdownContent}
            </ReactMarkdown>
        </Main.Content>
        <Main.Footer>
            <Back />
            <Next />
        </Main.Footer>
    </Main>
);

export default (props: Props) => ({
    name: 'Info',
    component: () => InfoStep(props),
});
