import debug from 'debug';
import { useValue, createArrayKeyStore, useDecorator, useLocalizer, useArrayKeys, useActionsFor, useArrayFormActions } from '@forml/hooks';
import { FormContext } from '@forml/context';
import t from 'prop-types';
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { FormType } from '../../../types';
import { Item } from './Item';
import { Range } from './Range';

const log = debug('forml:core:array');

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
    const { form, onChange } = props;

    const array = useValue(form.key);
    const store = useRef(createArrayKeyStore(array)).current;

    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [form]
    );
    const Component = useMemo(() =>
        dragDrop ? DraggableArrayContainer : NormalArrayContainer
    );

    return (
        <FormContext.Provider value={store}>
            <Component {...props}>
                <ArrayRanges form={form} onChange={onChange} />
            </Component>
        </FormContext.Provider>
    );
}

function ArrayRanges(props) {
    const { form, onChange } = props;
    const keys = useArrayKeys();
    const ranges = useMemo(
        function() {
            const ranges = [];
            const count = keys?.length ?? 0;

            if (count > 0) {
                const perRange = Math.max(Math.ceil(Math.sqrt(count)), 10);
                const totalRanges = Math.ceil(count / perRange);

                for (let range = 0; range < totalRanges; range++) {
                    const start = range * perRange;
                    const end = start + perRange;
                    ranges.push(
                        <Range
                            key={range}
                            form={form}
                            start={start}
                            end={end}
                            onChange={onChange}
                        />
                    );
                }
            }
            return ranges;
        },
        [keys, form, onChange]
    );

    return <>{ranges}</>;
}

const DraggableArrayContainer = forwardRef(
    function DraggableArrayContainer(props, ref) {
        const { form } = props;
        const actions = useActionsFor(form.key, useArrayFormActions());
        const droppableId = useMemo(shortid);
        const onDragEnd = useCallback(
            function onDragEnd(result) {
                if (!result.destination) {
                    return;
                } else if (result.destination.index === result.source.index) {
                    return;
                } else {
                    const nextModel = actions.moveArray(
                        result.source.index,
                        result.destination.index
                    );
                    const event = new Event('change', { bubbles: true });
                    props.onChange(event, nextModel);
                }
            },
            [actions.moveArray]
        );
        const renderDraggableItems = useCallback(
            (provided) => {
                const injectRef = (e) => {
                    provided.innerRef(e);
                    if (ref) ref(e);
                };
                return (
                    <NormalArrayContainer
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
        const { form, onChange } = props;
        const { readonly: disabled, titleFun } = form;
        const deco = useDecorator();
        const localizer = useLocalizer();
        const actions = useActionsFor(form.key, useArrayFormActions())
        const title = useMemo(
            () =>
                localizer.getLocalizedString(
                    titleFun?.() ?? form.title
                ),
            [localizer, form, titleFun]
        );
        const description = localizer.getLocalizedString(form.description);
        const { error } = props;

        const addItem = useCallback((event) => {
            const nextModel = actions.appendArray();
            onChange(event, nextModel);
        }, [actions.appendArray, form.key, onChange]);

        return (
            <deco.Arrays.Items
                className={form.htmlClass}
                add={addItem}
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
