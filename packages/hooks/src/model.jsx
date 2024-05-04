import { ModelContext, RenderingContext } from '@forml/context';
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
import AJV from 'ajv';

/**
 * Hook to use the entire forml context
 * @return {Context}
 */

export function usePrefix() {
    const { prefix } = useReactContext(RenderingContext);
    return useMemo(() => {
        if (prefix) {
            if (Array.isArray(prefix)) {
                return prefix;
            } else {
                return objectPath.parse(prefix);
            }
        } else {
            return [];
        }
    })
}

export function usePrefixed(key) {
    const prefix = usePrefix();
    return useMemo(() => {
        if (key) {
            if (Array.isArray(key)) {
                return prefix.concat(key);
            } else {
                return prefix.concat(objectPath.parse(key));
            }
        } else {
            return prefix;
        }
    }, [prefix, key]);
}

export function createModelStore(schema, model) {
    const ajv = useMemo(() => new AJV({ allErrors: true, strict: false }), []);
    return createStore()(function() {
        return {
            schema,
            model: assertType(schema, model),
            ajv,
        }
    });
};

export function useAJV() {
    return useStore(useModelContext(), useShallow(state => state.ajv));
}

export function useActions() {
    const prefix = usePrefix();
    const store = useModelContext();
    return useMemo(() => ({
        setValue(key, value) {
            let final;
            store.setState((state) => {
                const stack = [];
                const [currentKey, currentModel, currentSchema] = seek(
                    state.schema,
                    [...prefix, ...key],
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
                    [...prefix, ...key],
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
                    [...prefix, ...key],
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
                    [...prefix, ...key],
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
                    [...prefix, ...key],
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
    }), [prefix, store]);
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
    const prefix = usePrefix();
    return useSchemaFor(prefix);
}

export function useSchemaFor(key) {
    key = usePrefixed(key);
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

    return useStore(useModelContext(), useShallow(schemaSelector));
}

export function useModel() {
    const prefix = usePrefix();
    return useModelFor(prefix);
}

export function useValue(key = []) {
    key = usePrefixed(key);
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

    return useStore(useModelContext(), useShallow(modelSelector));
}

const validators = new WeakMap();
export function useValidatorFor(schema) {
    const ajv = useAJV();
    return useMemo(() => {
        if (validators.has(schema)) {
            return validators.get(schema);
        } else {
            const validator = ajv.compile(schema);
            const validate = (data) => {
                if (validator(data) === false) {
                    return ajv.errorsText(validator.errors);
                } else {
                    return null;
                }
            }
            validators.set(schema, validate);
            return validate;
        }
    }, [schema])
}

export function useModelFor(key) {
    key = usePrefixed(key);
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

    const { model, schema } = useStore(useModelContext(), useShallow(keySelector));
    const validate = useValidatorFor(schema);

    return useMemo(
        () => ({
            model,
            schema,
            validate
        }),
        [
            model,
            schema,
            validate
        ]
    );
}

export const useKey = useModelFor;
