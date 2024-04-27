import { useArrayKey, useDecorator, useLocalizer } from '@forml/hooks';
import objectPath from 'objectpath';
import t from 'prop-types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { FormType } from '../../../types';
import Item from './Item';

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

function ArrayComponent(props) {
    const { form, schema, onChange } = props;

    const type = useMemo(() => objectPath.stringify(form.key), [form.key]);
    const array = useArrayKey(form.key);

    const parent = form;
    const items = useMemo(
        function() {
            const arrays = [];
            const count = array.model?.length ?? 0;
            for (let index = 0; index < count; ++index) {
                const key = array.keys[index];
                arrays.push(
                    <Item
                        key={key}
                        {...array}
                        id={key}
                        forms={parent.items}
                        index={index}
                        form={form}
                        parent={parent}
                        type={type}
                        schema={schema}
                        onChange={onChange}
                        value={array.model[index]}
                    />
                );
            }
            return arrays;
        },
        [type, form, array, onChange, parent]
    );

    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [form]
    );
    const Component = useMemo(() =>
        dragDrop ? DraggableArrayContainer : NormalArrayContainer
    );

    return (
        <Component array={array} {...props}>
            {items}
        </Component>
    );
}

const DraggableArrayContainer = forwardRef(
    function DraggableArrayContainer(props, ref) {
        const { array } = props;
        const droppableId = useMemo(shortid);
        const onDragEnd = useCallback(
            function onDragEnd(result) {
                if (!result.destination) {
                    return;
                } else if (result.destination.index === result.source.index) {
                    return;
                } else {
                    array.moveArray(
                        result.source.index,
                        result.destination.index
                    );
                }
            },
            [array.moveArray]
        );
        const renderDraggableItems = useCallback(
            (provided) => {
                const injectRef = (e) => {
                    provided.innerRef(e);
                    if (ref) ref(e);
                };
                return (
                    <NormalArrayContainer
                        array={array}
                        {...props}
                        ref={injectRef}
                    >
                        {props.children}
                        {provided.placeholder}
                    </NormalArrayContainer>
                );
            },
            [props]
        );

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={droppableId}>
                    {renderDraggableItems}
                </Droppable>
            </DragDropContext>
        );
    }
);
const NormalArrayContainer = forwardRef(
    function NormalArrayContainer(props, ref) {
        const { form, array, onChange } = props;
        const { readonly: disabled, titleFun } = form;
        const deco = useDecorator();
        const localizer = useLocalizer();
        const title = useMemo(
            () =>
                localizer.getLocalizedString(
                    titleFun?.(array.model) ?? form.title
                ),
            [localizer, array.model, form, titleFun]
        );
        const description = localizer.getLocalizedString(form.description);
        const { error } = props;

        const addItem = useCallback((event) => {
            const nextModel = array.appendArray(form.key)
            onChange(event, nextModel);
        }, [array.appendArray, form.key, onChange]);

        return (
            <deco.Arrays.Items
                className={form.htmlClass}
                add={addItem}
                value={array.model}
                title={title}
                description={description}
                error={error}
                ref={ref}
                disabled={disabled}
                form={form}
            >
                {props.children}
            </deco.Arrays.Items>
        );
    }
);

export { ArrayComponent as Array, Item };
export default ArrayComponent;

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
