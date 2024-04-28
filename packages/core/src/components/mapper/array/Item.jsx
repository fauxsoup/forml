import debug from 'debug';
import React, { forwardRef, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { useDecorator, useLocalizer, useArrayActions } from '@forml/hooks';
import { ARRAY_PLACEHOLDER } from '../../../constants';
import { clone, traverseForm } from '../../../util';
import { SchemaField } from '../../schema-field';

const log = debug('forml:core:array:item');

export const Item = forwardRef(function Item(props, ref) {
    const { form, parent, forms, index, disabled } = props;
    const dragDrop = useMemo(
        () => ('dragDrop' in form ? form.dragDrop : true),
        [parent]
    );

    const Component = useMemo(() => {
        if (dragDrop) {
            return DraggableArrayItem;
        } else {
            return NormalArrayItem;
        }
    }, [dragDrop]);

    const fields = useMemo(
        () =>
            forms.map((template, subFormIndex) => {
                if (!template) return;
                const form = copyWithIndex(template, index);

                form.titleFun =
                    'titleFun' in form ? form.titleFun : parent.titleFun;
                form.readonly =
                    'readonly' in form ? form.readonly : disabled;

                return (
                    <SchemaField
                        key={subFormIndex}
                        form={form}
                        schema={form.schema}
                        parent={parent}
                        onChange={props.onChange}
                    />
                );
            }),
        [forms, index, parent.titleFun, disabled]
    );

    return (
        <Component {...props} ref={ref}>
            {fields}
        </Component>
    );
});

export default Item;

const NormalArrayItem = forwardRef(function NormalArrayItem(props, ref) {
    const { form, array, value, index, onChange, dragHandleProps, draggableProps } =
        props;
    const { readonly: disabled } = form;
    const deco = useDecorator();
    const localizer = useLocalizer();

    const title = useMemo(() => {
        let title = form.title;
        if (form.titleFun) {
            title = form.titleFun(value);
        }

        return localizer.getLocalizedString(title);
    }, [form, value, localizer]);

    const arrayActions = useArrayActions(form.key);
    const actions = useMemo(function() {
        return {
            destroy: function() {
                const nextModel = arrayActions.removeArray(index);
                onChange(new Event('change', { bubbles: true }), nextModel);
                return nextModel;
            },
            moveUp: function() {
                const nextModel = arrayActions.moveArray(index, index - 1)
                onChange(new Event('change', { bubbles: true }), nextModel);
                return nextModel;
            },
            moveDown: function() {
                const nextModel = arrayActions.moveArray(index, index + 1)
                onChange(new Event('change', { bubbles: true }), nextModel);
                return nextModel;
            },
        };
    }, [
        arrayActions,
        form.key,
        index,
        onChange
    ]);

    return (
        <deco.Arrays.Item
            disabled={disabled}
            title={title}
            index={index}
            form={form}
            dragHandleProps={dragHandleProps}
            draggableProps={draggableProps}
            {...actions}
            ref={ref}
        >
            {props.children}
        </deco.Arrays.Item>
    );
});

function DraggableItemFactory(props, ref) {
    return function DraggableItem(provided) {
        const injectRef = (e) => {
            provided.innerRef(e);
            if (ref) ref(e);
        };
        return (
            <NormalArrayItem {...props} {...provided} ref={injectRef}>
                {props.children}
            </NormalArrayItem>
        );
    };
}

const DraggableArrayItem = forwardRef(function DraggableArrayItem(props, ref) {
    return (
        <Draggable draggableId={props.id} index={props.index}>
            {DraggableItemFactory(props, ref)}
        </Draggable>
    );
});

function copyWithIndex(form, index) {
    const copy = clone(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function(form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    };
}
