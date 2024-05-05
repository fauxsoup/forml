import { render, fireEvent, waitFor } from '@testing-library/react';

import { SchemaForm, getLocalizer, util } from '../src';
import React, { createElement as h } from 'react';
import * as barebones from '@forml/decorator-barebones';

describe('mapper', function () {
    const title = 'title';
    const description = 'description';
    const decorator = barebones;
    let forms = [
        [
            {
                key: [],
                type: 'array',
                items: [],
                title,
                description,
                schema: { type: 'array', items: { type: 'string' } },
            },
        ],
        [
            {
                key: [],
                type: 'checkbox',
                title,
                description,
                schema: { type: 'boolean' },
            },
        ],
        [
            {
                key: [],
                type: 'date',
                title,
                description,
                schema: { type: 'string', format: 'date' },
            },
        ],
        [
            {
                key: [],
                type: 'datetime',
                title,
                description,
                schema: { type: 'string', format: 'date-time' },
            },
        ],
        [{ key: [], type: 'fieldset', items: [], title, description }],
        [
            {
                key: [],
                type: 'file',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
        [{ key: [], type: 'help', title, description }],
        [
            {
                key: [],
                type: 'integer',
                title,
                description,
                schema: { type: 'integer' },
            },
        ],
        [
            {
                key: [],
                type: 'multiselect',
                title,
                description,
                schema: {
                    type: 'array',
                    items: { type: 'string' },
                    enum: ['a', 'b', 'c'],
                    uniqueItems: true,
                },
            },
        ],
        [
            {
                key: [],
                type: 'number',
                title,
                description,
                schema: { type: 'number' },
            },
        ],
        [
            {
                key: [],
                type: 'select',
                title,
                description,
                schema: { type: 'string', enum: ['a', 'b', 'c'] },
            },
        ],
        [
            {
                key: [],
                type: 'tabs',
                title,
                description,
                tabs: [],
            },
        ],
        [
            {
                key: [],
                type: 'text',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
        [
            {
                key: [],
                type: 'textarea',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
    ];

    for (let form of forms) {
        const [{ type, schema }] = form;

        test(`${type} localizes title and description`, function () {
            const model = schema ? util.defaultForSchema(schema) : null;
            const localizer = getLocalizer({
                getLocalizedString: jest.fn((id) => id),
            });
            const { container } = render(
                h(SchemaForm, { model, form, schema, localizer, decorator })
            );

            expect(localizer.getLocalizedString).toHaveBeenCalledWith(title);
            expect(localizer.getLocalizedString).toHaveBeenCalledWith(
                description
            );
        });

        const excludeFromChangeEvents = ['file', 'checkbox', 'array'];
        if (schema && !excludeFromChangeEvents.includes(type)) {
            const model = util.defaultForSchema(schema);
            test(`${type} processes change events`, async function () {
                let newModel = jest.fn();
                let onChange = (event, nextModel) => newModel(nextModel);
                let { container } = render(
                    <SchemaForm
                        decorator={decorator}
                        model={model}
                        form={form}
                        schema={schema}
                        onChange={onChange}
                    />
                );

                let inputs = container.querySelectorAll(
                    'input, select, textarea'
                );
                expect(inputs.length).toBeGreaterThan(0);

                for (let input of inputs) {
                    const value = util.randomForSchema(schema);
                    fireEvent.change(input, {
                        target: { value },
                    });
                    expect(newModel).toHaveBeenCalledWith(value);
                    newModel.mockClear();
                }
            });
        }
    }
});
