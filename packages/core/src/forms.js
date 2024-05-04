import ObjectPath from 'objectpath';

import { ARRAY_PLACEHOLDER } from './constants';
import { test } from './rules';
import { findSchema } from './util';

export function getDefaults(schema) {
    const form = [];
    const lookup = {};

    form.push(test(schema, { path: [], lookup }));

    return { form, lookup };
}

export function merge(schema, form = ['*'], options = {}) {
    if (!schema) return [];
    if (!form) return [];

    const stdForm = getDefaults(schema);

    const idx = form.indexOf('*');
    if (idx !== -1) {
        form = form
            .slice(0, idx)
            .concat(stdForm.form)
            .concat(form.slice(idx + 1));
    }

    const { lookup } = stdForm;
    form = form.reduce((acc, obj) => {
        if (obj === undefined || obj === null || obj === false || obj === 0) {
            return acc;
        }

        if (typeof obj === 'function') {
            acc.push(obj);
            return acc;
        }

        if (typeof obj === 'string') {
            obj = { key: obj };
        }

        if (typeof obj.key === 'string') {
            obj.key = ObjectPath.parse(obj.key);
        }

        if (options.prefix) {
            obj.key = options.prefix.concat(obj.key);
        }

        if (obj.key) {
            while (obj.key.includes('')) {
                obj.key[obj.key.indexOf('')] = ARRAY_PLACEHOLDER;
            }
        }

        if (obj.key) {
            obj.schema = findSchema(obj.key, schema);

            const strid = ObjectPath.stringify(obj.key);
            if (lookup[strid]) {
                obj = { ...lookup[strid], ...obj };
            }
        }

        if (Array.isArray(obj.items)) {
            obj.items = merge(schema, obj.items, { ...options });
        }

        if (Array.isArray(obj.tabs)) {
            obj.tabs = merge(schema, obj.tabs, { ...options });
        }

        if (obj.titles && !obj.titleMap) {
            const values = obj.schema.enum || obj.schema.items.enum;
            obj.titleMap = obj.titles.map((name, index) => {
                const value = values[index];
                return { name, value };
            });
        }

        acc.push(obj);
        return acc;
    }, []);

    return form;
}

export function standardForm(schema, options = {}) {
    const f = {};

    f.key = Array.from(options.path);

    if ('title' in schema) {
        f.title = schema.title;
    }

    if (options.lookup) {
        const strid = ObjectPath.stringify(f.key);
        options.lookup[strid] = f;
    }

    if (schema.description) {
        f.description = schema.description;
    }

    if ('required' in schema) {
        f.required = options.required = schema.required;
    } else if ('required' in options) {
        f.required = options.required;
    }

    if (schema.maxLength) {
        f.maxLength = schema.maxLength;
    }
    if (schema.minLength) {
        f.minLength = schema.minLength;
    }

    if ('readOnly' in schema) {
        f.readonly = schema.readOnly;
    } else if ('readonly' in schema) {
        f.readonly = schema.readonly;
    } else if ('readonly' in options) {
        f.readonly = options.readonly;
    }

    if ('minimum' in schema) {
        f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
    }
    if ('maximum' in schema) {
        f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
    }

    // Non standard attributes (DONT USE DEPRECATED)
    // If you must set stuff like this in the schema use the x-schema-form attribute
    if (schema.validationMessage) {
        f.validationMessage = schema.validationMessage;
    }

    f.schema = schema;

    return f;
}
