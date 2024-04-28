import { useContext, useMemo } from 'react';
import { useModelFor, useActionsFor } from './model';
import { FormContext } from '@forml/context';
import { createStore, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import shortid from 'shortid';

export function createArrayKeyStore(items) {
    return createStore()(function() {
        return {
            keys: new Array(items?.length ?? 0).fill(null).map(() => shortid()),
        };
    });
}
export function useArrayFormActions() {
    const store = useContext(FormContext);

    return useMemo(() => {
        return {
            reset: () => store.setState([]),
            appendArray: (key, item) => store.setState(function(state) {
                const keys = Array.from(state.keys);
                keys.push(shortid());
                return { keys };
            }),
            removeArray: (key, index) => store.setState(function(state) {
                const before = state.keys.slice(0, index);
                const after = state.keys.slice(index + 1);
                return { keys: before.concat(after) };
            }),
            moveArray: (key, from, to) => store.setState(function(state) {
                const nextModel = Array.from(state.keys);
                const [removed] = nextModel.splice(from, 1);
                nextModel.splice(to, 0, removed);
                return { keys: nextModel };
            }),
        };
    }, [store]);
}

export function useArrayKeyStore() {
    return useContext(FormContext);
}
export function useArrayKeys() {
    return useStore(useArrayKeyStore(), useShallow(state => state.keys))
}
export function useArrayKeyFor(index) {
    return useStore(useArrayKeyStore(), useShallow(state => state.keys[index]))
}

export function useArrayKeyRange(start, end) {
    return useStore(useArrayKeyStore(), useShallow(state => state.keys.slice(start, end)));
}

export function useArray(key) {
    const array = useModelFor(key);
    const actions = useArrayActions(key);
    return { ...array, ...actions };
}

export function useArrayActions(key) {
    return useActionsFor(key, useArrayFormActions());
}

export function useArrayRange(key, start, end) {
}
