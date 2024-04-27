import { useReducer, useEffect, useMemo } from 'react';
import { createAction, createReducer } from './reducer';
import { useModelFor, useActionsFor } from './model';
import shortid from 'shortid';

const reset = createAction('reset');
const appendArray = createAction('append', (item) => ({ item }));
const removeArray = createAction('remove', (index) => ({ index }));
const moveArray = createAction('move', (from, to) => ({ from, to }));

const reduceItems = createReducer((builder) => {
    builder.addCase(reset, (_state, _action) => {
        return [];
    });
    builder.addCase(appendArray, (state, action) => {
        const { item } = action.payload;
        return [...state, item];
    });
    builder.addCase(removeArray, (state, action) => {
        const { index } = action.payload;
        return [...state.slice(0, index), ...state.slice(index + 1)];
    });
    builder.addCase(moveArray, (state, action) => {
        const { from, to } = action.payload;
        const nextModel = [...state];
        const [removed] = nextModel.splice(from, 1);
        nextModel.splice(to, 0, removed);
        return nextModel;
    });
});

function useArrayForms(array) {
    const initialState = useMemo(() => {
        if (array.model) {
            return array.model.map(shortid);
        } else {
            return [];
        }
    }, []);
    const [keys, dispatch] = useReducer(reduceItems, initialState);
    const actions = useMemo(
        () => ({
            appendArray: () => dispatch(appendArray(shortid())),
            removeArray: (index) => dispatch(removeArray(index)),
            moveArray: (from, to) => dispatch(moveArray(from, to)),
            moveArrayUp: (index) => dispatch(moveArray(index, index - 1)),
            moveArrayDown: (index) => dispatch(moveArray(index, index + 1)),
        }),
        [dispatch]
    );
    return { keys, actions };
}

export function useArrayKey(key) {
    const array = useModelFor(key);
    const reducer = useArrayForms(array);
    const actions = useActionsFor(key, reducer.actions);
    return { ...array, ...actions, keys: reducer.keys };
}
