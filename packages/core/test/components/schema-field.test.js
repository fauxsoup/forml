import { ModelContext, RenderingContext } from '@forml/context';
import { SchemaField } from '../../src/components/schema-field';
import React from 'react';
import { getMapper } from '../../src/components/mapper';
import { getLocalizer } from '../../src/localizer';
import * as util from '../../src/util';
import renderer from 'react-test-renderer';
import * as barebones from '@forml/decorator-barebones';
import { createStore } from 'zustand';

function getModelContext(schema, model = '', errors = {}) {
    return createStore()((set) => ({
        schema, model, errors,
        setValue: (key, value) => set({ model: { ...model, [key]: value } }),
    }));
}

function getRenderingContext() {
    return {
        decorator: barebones,
        localizer: getLocalizer({}),
        mapper: getMapper({
            array: jest.fn(() => 'array'),
            checkbox: jest.fn(() => 'checkbox'),
            date: jest.fn(() => 'date'),
            datetime: jest.fn(() => 'datetime'),
            dynamic: jest.fn(() => 'dynamic'),
            fieldset: jest.fn(() => 'fieldset'),
            help: jest.fn(() => 'help'),
            integer: jest.fn(() => 'integer'),
            multiselect: jest.fn(() => 'multiselect'),
            null: jest.fn(() => 'null'),
            number: jest.fn(() => 'number'),
            password: jest.fn(() => 'password'),
            select: jest.fn(() => 'select'),
            tabs: jest.fn(() => 'tabs'),
            text: jest.fn(() => 'text'),
            textarea: jest.fn(() => 'textarea'),
            tuple: jest.fn(() => 'tuple'),
            file: jest.fn(() => 'file'),
        }),
    };
}

test('does not render if no mapped Field is found for type', function () {
    const schema = { type: 'object' };
    const form = { key: [], type: 'custom', schema };
    const modelContext = getModelContext(schema, {});
    const renderingContext = getRenderingContext();

    const component = renderer.create(
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelContext}>
                <SchemaField form={form} schema={schema} />
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
    expect(component).toMatchSnapshot();
});

test('uses mapper from context', function () {
    const schema = { type: 'string' };
    const form = { key: [], type: 'text', schema };
    const modelContext = getModelContext(schema, {});
    const renderingContext = getRenderingContext();

    console.error('renderingContext: %O', renderingContext);

    const _component = renderer.create(
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelContext}>
                <SchemaField form={form} schema={schema} />
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );

    expect(renderingContext.mapper.text).toHaveBeenCalled();
});
