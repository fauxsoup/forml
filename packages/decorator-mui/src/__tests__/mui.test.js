import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { render } from '@testing-library/react';
import { SchemaForm, util } from '@forml/core';
import React from 'react';
import * as mui from '../';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({});

describe('Material UI', function () {
    describe('with no model', function () {
        beforeEach(function () {
            jest.mock('@mui/utils', () => ({
                __esModule: true,
                ...jest.requireActual('@mui/utils'),
                useId: () => {
                    return '1';
                },
            }));
        });
        const tests = [
            ['root string', { type: 'string' }],
            ['root number', { type: 'number' }],
            ['root integer', { type: 'integer' }],
            ['root date', { type: 'string', format: 'date' }],
            // ['root date-time', { type: 'string', format: 'date-time' }],
            ['root enumeration', { type: 'string', enum: ['a', 'b', 'c'] }],
            [
                'root multiselect',
                {
                    type: 'array',
                    items: { type: 'string', enum: ['a', 'b', 'c'] },
                    uniqueItems: true,
                },
            ],
            //[
            //    'root tuple',
            //    { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
            //],
            //['root array', { type: 'array', items: { type: 'string' } }],
            [
                'root object',
                {
                    type: 'object',
                    properties: {
                        test: { type: 'string' },
                        nested: {
                            type: 'object',
                            properties: {
                                property: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        ];

        const form = ['*'];
        const decorator = mui;

        for (let [name, schema] of tests) {
            test(`renders empty ${name} consistently`, function () {
                const model = util.defaultForSchema(schema);
                const { container } = render(
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <SchemaForm
                                schema={schema}
                                form={form}
                                model={model}
                                decorator={decorator}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                );

                expect(container).toMatchSnapshot();
            });
        }
    });
});
