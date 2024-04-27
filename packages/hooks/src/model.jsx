import { ModelContext } from '@forml/context';
import objectPath from 'objectpath';
import { useCallback, useMemo, useContext as useReactContext } from 'react';
import { createStore, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
    assertType,
    defaultForSchema,
    getNextSchema,
    modelDrop,
    seek,
    unwind,
} from './common';

// validation temporarily disabled
// import AJV from 'ajv';

/**
 * Hook to use the entire forml context
 * @return {Context}
 */

export function createModelStore(schema, model) {
    // const ajv = useMemo(() => new AJV({ allErrors: true, strict: false }), []);

    return createStore()(function() {
        return {
            schema,
            model: assertType(schema, model),
        }
    });
};

export function useActions() {
    const store = useModelContext();
    return useMemo(() => ({
        setValue(key, value) {
            let final;
            store.setState((state) => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    key,
                    state.model,
                    stack
                );
                final = unwind(currentSchema, currentKey, value, stack);
                return {
                    ...state,
                    model: final,
                };
            });
            return final;
        },
        removeValue(key) {
            let final;
            store.setState((state) => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    key,
                    state.model,
                    stack
                );
                final = unwind(currentSchema, currentKey, currentModel, stack, 1);
                return {
                    ...state,
                    model: final,
                };
            })
            return final;
        },
        appendArray(key, value) {
            let final;
            store.setState(state => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    key,
                    state.model,
                    stack
                );
                const parentModel = currentModel ?? defaultForSchema(currentSchema);
                stack.push([currentKey, parentModel, currentSchema]);

                const itemKey = parentModel.length;
                const itemSchema = getNextSchema(currentSchema, itemKey);
                const itemModel = assertType(itemSchema, value);

                final = unwind(itemSchema, itemKey, itemModel, stack);

                return {
                    ...state,
                    model: final,
                };
            });
            return final;
        },
        removeArray(key, index) {
            let final;
            store.setState(state => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    key,
                    state.model,
                    stack
                );
                final = unwind(
                    currentSchema,
                    currentKey,
                    modelDrop(currentSchema, currentModel, index),
                    stack
                );
                return {
                    ...state,
                    model: final,
                };
            })
            return final;
        },
        moveArray(key, from, to) {
            let final;
            store.setState(state => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    key,
                    state.model,
                    stack
                );
                const nextModel = currentModel
                    ? Array.from(currentModel)
                    : defaultForSchema(currentSchema);
                const [removed] = nextModel.splice(from, 1);
                nextModel.splice(to, 0, removed);
                final = unwind(currentSchema, currentKey, nextModel, stack);
                return {
                    ...state,
                    model: final,
                };
            })
            return final;
        }
    }), [store]);
}

export function useActionsFor(key, mergeActions = {}) {
    const actions = useActions();
    return useMemo(
        function() {
            const setValue = mergeAction(actions.setValue, mergeActions.setValue);
            const removeValue = mergeAction(actions.removeValue, mergeActions.removeValue);
            const appendArray = mergeAction(actions.appendArray, mergeActions.appendArray);
            const removeArray = mergeAction(actions.removeArray, mergeActions.removeArray);
            const moveArray = mergeAction(actions.moveArray, mergeActions.moveArray);
            return {
                ...actions,
                setValue: (value) => setValue(key, value),
                removeValue: () => removeValue(key),
                appendArray: (value) => appendArray(key, value),
                removeArray: (index) => removeArray(key, index),
                moveArray: (from, to) => moveArray(key, from, to),
            };
        },
        [actions, key]);
}

function mergeAction(action, mergeAction) {
    if (mergeAction) {
        return function mergedAction(...args) {
            mergeAction(...args);
            return action(...args);
        };
    } else {
        return action;
    }
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModelContext() {
    return useReactContext(ModelContext);
}

export function useSchema() {
    return useModel(state => state.schema)
}

export function useSchemaFor(key) {
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const schemaSelector = useCallback(
        function({ model, schema }) {
            const [_currentKey, _currentModel, currentSchema] = seek(
                schema,
                key,
                model,
                []
            );
            return currentSchema;
        },
        [path]
    );

    return useModel(schemaSelector);
}

export function useModel(selector) {
    return useStore(useModelContext(), useShallow(selector))
}

export function useValue(key = []) {
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const modelSelector = useCallback(
        function({ model, schema }) {
            const [_currentKey, currentModel] = seek(
                schema,
                key,
                model,
                []
            );
            return currentModel;
        },
        [path]
    );

    return useModel(modelSelector);
}
export function useModelFor(key) {
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const keySelector = useCallback(
        function({ model, schema }) {
            const [_currentKey, currentModel, currentSchema] = seek(
                schema,
                key,
                model,
                []
            );

            return {
                model: currentModel,
                schema: currentSchema,
            };
        },
        [path]
    );

    //const validate = useMemo(
    //    () => model.ajv.compile(attributes.schema),
    //    [attributes.schema]
    //);

    return useModel(keySelector);
}

export const useKey = useModelFor;
