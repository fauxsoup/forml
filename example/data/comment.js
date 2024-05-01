import debug from 'debug';
import React, { useMemo, useRef } from 'react';
import { SchemaForm } from '@forml/core';
import { useRenderingContext, useValue } from '@forml/hooks';

const log = debug('rjsf:example:data:comment');

export const schema = {
    type: 'object',
    title: 'Comment',
    description: 'Tell the internet your feelings',
    properties: {
        name: {
            title: 'Name',
            type: 'string',
            description: 'First and last name',
        },
        email: {
            title: 'Email',
            type: 'string',
            pattern: '^\\S+@\\S+$',
            description: 'Email will be used for evil.',
        },
        phoneNumber: {
            title: 'Phone Number',
            type: 'string',
            pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}',
            description: 'The best number at which to reach you',
        },
        spam: { title: 'Spam', type: 'boolean', default: true },
        tos: { title: 'Terms and Conditions', type: 'boolean', default: false },
        comment: {
            title: 'Comment',
            type: 'string',
            maxLength: 20,
            validationMessage: "Don't be greedy!",
        },
        type: {
            title: 'Type',
            type: 'string',
            enum: ['home', 'work', 'mobile', 'fax', 'etc'],
        },
        nested: {
            type: 'array',
            title: 'References',
            description: 'A list of references who can support your comment',
            items: {
                type: 'object',
                title: 'Reference',
                description: 'Someone you have worked with',
                properties: {
                    first: { title: 'First', type: 'string' },
                    last: { title: 'Last', type: 'string' },
                },
            },
        },
    },
    required: ['name', 'comment'],
};

export const mapper = {
    comment(props) {
        const { form: parent, onChangeSet } = props;
        const ctx = useRenderingContext();
        const model = useRef(props.value).current;
        return (
            <SchemaForm
                {...ctx}
                onChange={onChangeSet}
                schema={schema}
                form={form}
                model={model}
            />
        );
    },
};

export function form() {
    const email = useValue(['email']);
    const spamOption = useMemo(
        () =>
            !!email
                ? {
                      key: 'spam',
                      type: 'checkbox',
                      title: 'Yes I want spam.',
                  }
                : null,
        [!!email]
    );
    return useMemo(
        () => [
            {
                type: 'fieldset',
                layout: 'vertical',
                icon: 'alternate_email',
                title: 'Comment Submission',
                description:
                    'Give us some feedback that could help improve your experience.',
                items: [
                    {
                        type: 'fieldset',
                        disablePadding: true,
                        disableGutters: true,
                        disableMargin: true,
                        items: [
                            {
                                type: 'fieldset',
                                items: ['name', 'email', spamOption],
                                layout: 'vertical',
                            },
                            {
                                type: 'fieldset',
                                layout: 'vertical',
                                items: [
                                    'phoneNumber',
                                    {
                                        key: 'type',
                                        type: 'select',
                                        titleMap: [
                                            { name: 'Home', value: 'home' },
                                            { name: 'Work', value: 'work' },
                                            { name: 'Mobile', value: 'mobile' },
                                            { name: 'Fax', value: 'fax' },
                                            { name: 'Etc', value: 'etc' },
                                        ],
                                    },
                                ],
                            },
                        ],
                        layout: 'horizontal',
                    },
                    {
                        type: 'fieldset',
                        alignItems: 'flex-end',
                        items: [
                            {
                                key: 'comment',
                                type: 'textarea',
                                fullWidth: true,
                            },
                            { key: 'tos' },
                        ],
                        layout: 'vertical',
                    },
                ],
            },
            {
                type: 'fieldset',
                disableMargin: true,
                disablePadding: true,
                items: [
                    {
                        type: 'array',
                        icon: 'contacts',
                        disableGutters: true,
                        disableMargin: true,
                        key: 'nested',
                        wrap: false,
                        items: [
                            {
                                type: 'fieldset',
                                key: 'nested[]',
                                layout: 'vertical',
                                elevation: 0,
                                wrap: false,
                                icon: 'person',
                                items: ['nested[].first', 'nested[].last'],
                            },
                        ],
                    },
                ],
            },
        ],
        [spamOption]
    );
}
