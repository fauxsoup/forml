import { render, fireEvent, waitFor } from '@testing-library/react';

import { SchemaForm, util, constants } from '../../../src';
import React from 'react';
import * as barebones from '@forml/decorator-barebones';

describe('items container', function() {
    let schema;
    let form;
    let model;
    let decorator;

    beforeEach(function() {
        schema = { type: 'array', items: { type: 'number' } };
        form = ['*'];
        model = [];
        decorator = barebones;
    });

    test('is rendered', function() {
        const props = {
            schema,
            form,
            model,
            decorator,
        };
        const { container } = render(<SchemaForm {...props} />);

        expect(container).toMatchSnapshot();

        expect(container.querySelector('.array')).not.toBeNull();
        expect(container.querySelector('.array ul')).not.toBeNull();
        expect(container.querySelector('.array ul')).toBeEmptyDOMElement();
    });

    describe('with an add button', function() {
        test('which renders', function() {
            const props = { schema, form, model, decorator };
            const { container } = render(<SchemaForm {...props} />);

            const button = container.querySelector('button');
            expect(button).not.toBeNull();
        });
        test('which adds an item to the model', function() {
            const onChange = jest.fn((event, newModel) => {
                model = newModel;
            });
            const props = { schema, form, model, onChange, decorator };
            const { container } = render(<SchemaForm {...props} />);

            const button = container.querySelector('button');
            fireEvent.click(button);
            expect(model.length).toBe(1);
        });
    });

    test('cannot be mutated if disabled', async function() {
        let onChange = jest.fn((event, nextModel) => (model = nextModel));
        let schema = {
            type: 'array',
            items: { type: 'number' },
            readonly: true,
        };
        let model = [1];
        let props = { schema, form, model, onChange, decorator };
        let { container, rerender } = render(<SchemaForm {...props} />);

        const add = container.querySelector('button.add');

        fireEvent.click(add);
        rerender(<SchemaForm {...props} />);

        // 4 because move up, move down, destroy, and add
        // as long as we only have 1 item in the model we're good
        expect(container.querySelectorAll('button[disabled]').length).toBe(4);
    });
});

function getComputedSpacing({
    margin = noSpacing,
    padding = noSpacing,
    border = noSpacing,
    display = 'block',
}) {
    return {
        paddingTop: `${padding.top}px`,
        paddingRight: `${padding.right}px`,
        paddingBottom: `${padding.bottom}px`,
        paddingLeft: `${padding.left}px`,
        marginTop: `${margin.top}px`,
        marginRight: `${margin.right}px`,
        marginBottom: `${margin.bottom}px`,
        marginLeft: `${margin.left}px`,
        borderTopWidth: `${border.top}px`,
        borderRightWidth: `${border.right}px`,
        borderBottomWidth: `${border.bottom}px`,
        borderLeftWidth: `${border.left}px`,
        display,
    };
}

function mockGetComputedSpacing() {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() =>
        getComputedSpacing({})
    );
}

function mockGetBoundingClientRect(el) {
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            center: { x: 0, y: 0 },
        };
    });
}

const DND_DROPPABLE_DATA_ATTR = '[data-rbd-droppable-id]';
const DND_DRAGGABLE_DATA_ATTR = '[data-rbd-draggable-id]';

function mockElementSpacing({ container }) {
    const droppables = container.querySelectorAll(DND_DROPPABLE_DATA_ATTR);
    droppables.forEach((droppable) => {
        mockGetBoundingClientRect(droppable);
        const draggables = droppable.querySelectorAll(DND_DRAGGABLE_DATA_ATTR);
        draggables.forEach((draggable) => {
            mockGetBoundingClientRect(draggable);
        });
    });
}

describe('each item', function() {
    let schema = null;
    let form = null;
    let model = null;
    let setter = null;
    let getter = null;
    let onChange = null;
    let decorator = null;
    let props = null;

    beforeEach(function() {
        schema = { type: 'array', items: { type: 'number' } };
        form = ['*'];
        model = [1];
        setter = util.valueSetter(model, schema);
        getter = util.valueGetter(model, schema);
        onChange = jest.fn((event, newModel) => {
            model = newModel;
        });
        decorator = barebones;
        props = { schema, form, model, decorator };

        mockGetComputedSpacing();
    });

    test('is rendered', function() {
        const { container } = render(<SchemaForm {...props} />);
        expect(container.querySelector('.array ul li')).not.toBeNull();
    });

    // jsdom can't effectively mock this well enough to make it work; skip until
    // we find a workaround
    test.skip('can be dragged into a new position', async function() {
        const onChange = jest.fn();
        model = [1, 2, 3, 4];
        const utils = render(<SchemaForm {...{ ...props, model, onChange }} />);
        const { container } = utils;

        mockElementSpacing(utils);

        const items = container.querySelectorAll('.array .item .title');
        const source = items[2];
        const destination = items[3];

        source.focus();
        await fireEvent.keyDown(source, { keyCode: 32 });
        await fireEvent.keyDown(source, { keyCode: 40 });
        await fireEvent.keyDown(source, { keyCode: 32 });

        expect(onChange).toHaveBeenCalled();
    });

    describe('in readonly mode', function() {
        test.skip('propagates readonly', function() {
            model = [1];
            form = [
                {
                    key: '',
                    type: 'array',
                    readonly: true,
                    items: [{ type: 'number', key: '[]' }],
                },
            ];

            const { container } = render(
                <SchemaForm {...{ ...props, model, form }} />
            );

            expect(container.querySelectorAll('button[disabled]').length).toBe(
                4
            );
            expect(container.querySelector('input').disabled).toBe(true);
        });
        test('can be overrideden by explicit setting', function() {
            model = [1];
            form = [
                {
                    key: '',
                    type: 'array',
                    readonly: true,
                    items: [{ type: 'number', key: '[]', readonly: false }],
                },
            ];

            const { container } = render(
                <SchemaForm {...{ ...props, model, form }} />
            );

            expect(container.querySelectorAll('button[disabled]').length).toBe(
                4
            );
            expect(container.querySelector('input').disabled).toBe(false);
        });
    });

    describe('has controls', function() {
        test('to move up', function() {
            model = [1, 2];
            const { container } = render(
                <SchemaForm {...{ schema, form, model, onChange, decorator }} />
            );

            let buttons = container.querySelectorAll('.array .item .move-up');
            expect(buttons).not.toBeNull();
            expect(buttons.length).toBe(2);

            // Select the second button to move the second element UP into the first slot
            let [button1, button2] = buttons;
            fireEvent.click(button1);
            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([1, 2]);

            fireEvent.click(button2);
            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2, 1]);
        });

        test('to move down', function() {
            model = [1, 2];
            const { container } = render(
                <SchemaForm {...{ schema, form, model, onChange, decorator }} />
            );

            let buttons = container.querySelectorAll('.array .item .move-down');
            expect(buttons).not.toBeNull();
            expect(buttons.length).toBe(2);

            // Select the first button to move the first element DOWN into the second slot
            let [button1, button2] = buttons;
            fireEvent.click(button2);
            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([1, 2]);

            fireEvent.click(button1);
            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2, 1]);
        });

        test('to be destroyed', function() {
            model = [1, 2];
            const { container } = render(
                <SchemaForm {...{ schema, form, model, onChange, decorator }} />
            );

            let button = container.querySelectorAll('.array .item .delete');
            expect(button).not.toBeNull();
            expect(button.length).toBe(2);

            // Select the first button to move the first element DOWN into the second slot
            button = button[0];
            fireEvent.click(button);

            expect(onChange).toHaveBeenCalled();
            expect(model).toMatchObject([2]);
        });
    });
    describe('can specify titleFun', function() {
        test('which overrides form.title in children', function() {
            model = [1, 2];
            form = [
                {
                    key: [],
                    type: 'array',
                    titleFun(value) {
                        return `test`;
                    },
                    items: ['[]'],
                },
            ];

            const { container } = render(
                <SchemaForm {...{ form, model, schema, decorator }} />
            );

            expect(container.querySelector('ul li h6')).not.toBeNull();
            expect(container.querySelector('ul li h6').textContent).toBe(
                'test'
            );
        });
    });
});
