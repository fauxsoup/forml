import ObjectPath from 'objectpath';
import t from 'prop-types';
import React, { useEffect, useMemo, useState, forwardRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { ARRAY_PLACEHOLDER } from '../../constants';
import { useDecorator, useLocalizer, useModel } from '@forml/hooks';
import { FormType } from '../../types';
import {
    clone,
    defaultForSchema,
    getNextSchema,
    traverseForm,
} from '../../util';
import { SchemaField } from '../schema-field';

export function mover(items, value) {
    return move;
    function move(start, end) {
        return [reorder(items, start, end), reorder(value, start, end)];
        function reorder(list, start, end) {
            const result = Array.from(list);
            const [removed] = result.splice(start, 1);
            result.splice(end, 0, removed);
            return result;
        }
    }
}

export function creator(form) {
    return create;
    function create() {
        const forms = form.items.map(({ ...form }) => {
            const key = shortid();
            return { form, key };
        });

        const key = shortid();
        return { forms, key };
    }
}
export function useArrayItems(form, disabled = false) {
    const [items, setItems] = useState([]);
    const model = useModel();

    const value = model.getValue(form.key);
    const move = mover(items, value);
    const create = creator(form);

    useEffect(
        function () {
            const nextItems = items ? [...items] : [];

            for (let i = 0; i < value.length; ++i) {
                if (nextItems[i]) {
                    nextItems[i].forms = nextItems[i].forms.map(
                        ({ form: subForm, key }, index) => {
                            subForm = { ...form.items[index] };
                            return { form: subForm, key };
                        }
                    );
                } else {
                    const item = create(i);
                    nextItems.push(item);
                }
            }

            setItems(nextItems);
        },
        [form]
    );

    function add(event) {
        const nextSchema = getNextSchema(form.schema, value.length);
        const nextModel = model.setValue(
            [...form.key, value.length],
            defaultForSchema(nextSchema)
        );
        model.onChange(event, nextModel);
        setItems([...items, create(items.length)]);
    }

    function destroyer(index) {
        function destroy(event) {
            const nextValue = Array.from(value);
            nextValue.splice(index, 1);

            const nextItems = Array.from(items);
            nextItems.splice(index, 1);

            const nextModel = model.setValue(form.key, nextValue);
            model.onChange(event, nextModel);
            setItems(nextItems);
        }

        return destroy;
    }

    function upwardMover(index) {
        function mover(event) {
            if (index > 0) {
                const [nextItems, nextValue] = move(index, index - 1);
                const nextModel = model.setValue(form.key, nextValue);
                model.onChange(event, nextModel);
                setItems(nextItems);
            }
        }

        return mover;
    }

    function downwardMover(index) {
        function mover(event) {
            if (index < items.length - 1) {
                const [nextItems, nextValue] = move(index, index + 1);
                const nextModel = model.setValue(form.key, nextValue);
                model.onChange(event, nextModel);
                setItems(nextItems);
            }
        }

        return mover;
    }

    let result = { items, setItems };
    if (!disabled) {
        result = {
            ...result,
            add,
            destroyer,
            upwardMover,
            downwardMover,
            move,
        };
    } else {
        result = {
            ...result,
            add: /* istanbul ignore next */ () => null,
            destroyer: () => null,
            upwardMover: () => null,
            downwardMover: () => null,
            move: /* istanbul ignore next */ () => null,
        };
    }

    return result;
}

function BaseArrayItem(props, ref) {
    const { form, index, items } = props;
    const { readonly: disabled } = form;
    const model = useModel();
    const deco = useDecorator();
    const localizer = useLocalizer();
    const value = model.getValue([...form.key, index]);

    let title = form.title;
    if (form.titleFun) {
        title = form.titleFun(value);
    }

    title = localizer.getLocalizedString(title);

    const destroy = useMemo(() => items.destroyer(index), [items, form, index]);
    const moveUp = useMemo(
        () => items.upwardMover(index),
        [items, form, index]
    );
    const moveDown = useMemo(
        () => items.downwardMover(index),
        [items, form, index]
    );

    const dragDrop = 'dragDrop' in form ? form.dragDrop : true;

    if (dragDrop) {
        return (
            <Draggable draggableId={props.id} index={index}>
                {(provided) => {
                    return (
                        <deco.Arrays.Item
                            disabled={disabled}
                            title={title}
                            destroy={destroy}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            index={index}
                            form={form}
                            ref={(e) => {
                                provided.innerRef(e);
                                if (ref) ref(e);
                            }}
                            otherProps={{
                                draggableProps: provided.draggableProps,
                                dragHandleProps: provided.dragHandleProps,
                            }}
                        >
                            {props.children}
                        </deco.Arrays.Item>
                    );
                }}
            </Draggable>
        );
    } else {
        return (
            <deco.Arrays.Item
                disabled={disabled}
                title={title}
                destroy={destroy}
                moveUp={moveUp}
                moveDown={moveDown}
                index={index}
                ref={ref}
                form={form}
                otherProps={{}}
            >
                {props.children}
            </deco.Arrays.Item>
        );
    }
}

export const ArrayItem = forwardRef(BaseArrayItem);

/**
 * @name ArrayComponent
 * @component ArrayComponent
 * @description
 * A wrapper for the array that utilizes the useArrayItems hook
 * to keep track of its children. Invokes the [Context's](/docs/context)
 *
 * Usage:
 *
 * ```jsx
 * const value = ['a', 'b', 'c'];
 * const form = {type: 'array', items: {type: 'string'}};
 * const error = null;
 * <ArrayComponent value={value} form={form} error={error} />
 * ```
 */
function ArrayComponent(props, ref) {
    const { form, value } = props;
    const { error } = props;

    const { readonly: disabled, titleFun } = form;

    const type = useMemo(() => ObjectPath.stringify(form.key), [form.key]);
    const droppableId = useMemo(shortid);
    const items = useArrayItems(form, disabled);
    const deco = useDecorator();
    const localizer = useLocalizer();
    const model = useModel();

    let { otherProps } = form;

    if (!otherProps) otherProps = {};

    const parent = form;
    const arrays = useMemo(
        function () {
            const arrays = [];
            for (let i = 0; i < items.items.length; ++i) {
                const item = items.items[i];
                const forms = item.forms.map(function ({ form, key }) {
                    if (!form) return;
                    const formCopy = copyWithIndex(form, i);

                    /**
                     * Override properties of the child form
                     * titleFun - to generate a title for the sub-form
                     * disabled - to propagate the disabled state to children
                     */
                    formCopy.titleFun =
                        'titleFun' in formCopy ? formCopy.titleFun : titleFun;
                    formCopy.readonly =
                        'readonly' in formCopy ? formCopy.readonly : disabled;

                    return (
                        <SchemaField
                            key={key}
                            form={formCopy}
                            schema={formCopy.schema}
                            parent={parent}
                        />
                    );
                });

                arrays.push(
                    <ArrayItem
                        key={item.key}
                        id={item.key}
                        form={form}
                        index={i}
                        items={items}
                        item={item}
                        type={type}
                    >
                        {forms}
                    </ArrayItem>
                );
            }
            return arrays;
        },
        [items.items]
    );

    const title = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);
    const dragDrop = 'dragDrop' in form ? form.dragDrop : true;

    if (dragDrop) {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={droppableId}>
                    {(provided) => (
                        <deco.Arrays.Items
                            className={form.htmlClass}
                            add={items.add}
                            value={value}
                            title={title}
                            description={description}
                            error={error}
                            ref={(...args) => {
                                provided.innerRef(...args);
                                if (ref) ref(...args);
                            }}
                            otherProps={otherProps}
                            disabled={disabled}
                            form={form}
                        >
                            {arrays}
                            {provided.placeholder}
                        </deco.Arrays.Items>
                    )}
                </Droppable>
            </DragDropContext>
        );
    } else {
        return (
            <deco.Arrays.Items
                className={form.htmlClass}
                add={items.add}
                value={value}
                title={title}
                description={description}
                error={error}
                ref={ref}
                otherProps={otherProps}
                disabled={disabled}
                form={form}
            >
                {arrays}
            </deco.Arrays.Items>
        );
    }

    /* istanbul ignore next */
    function onDragEnd(result) {
        if (!result.destination) {
            return;
        } else if (result.destination.index === result.source.index) {
            return;
        } else {
            const [nextItems, nextValue] = items.move(
                result.source.index,
                result.destination.index
            );
            const nextModel = model.setValue(form.key, nextValue);
            model.onChange({ target: { value: nextModel } }, nextModel);
            items.setItems(nextItems);
        }
    }
}
export default forwardRef(ArrayComponent);

ArrayComponent.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the array */
    value: t.array,
};

ArrayComponent.defaultProps = {
    value: [],
};

function copyWithIndex(form, index) {
    const copy = clone(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function (form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    };
}
