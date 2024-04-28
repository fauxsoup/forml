import { createContext } from 'react';

/**
 * @typedef {Object} ModelMethods
 * @property {function} getValue - Retrieve a value from the model
 * @property {function} setValue - Update a value in the model
 * @property {function} getError - Retrieve a validation error from the model
 * @property {function} onChange - The callback to use when an event triggers
 * a change in the model.
 */

export const ModelContext = createContext({
    mapper: {},
    version: 0,
});
export const RenderingContext = createContext({
    mapper: {},
    decorator: {},
    localizer: {},
});
export const FormContext = createContext({});

export default ModelContext;
