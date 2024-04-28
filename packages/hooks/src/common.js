import debug from 'debug';

const log = debug('forml:hooks:common');

export function modelSetArray(
    targetSchema,
    targetModel,
    targetKey,
    schema,
    model
) {
    const prefix = targetModel.slice(0, targetKey);
    const suffix = targetModel.slice(targetKey + 1);

    // pad any missing elements up to where the target is being inserted
    while (prefix.length < targetKey) {
        prefix.push(
            defaultForSchema(getNextSchema(targetSchema, prefix.length))
        );
    }

    // combine into a new model and apply schema fixes

    const nextModel = prefix.concat([assertType(schema, model)]).concat(suffix);
    return assertType(targetSchema, nextModel);
}
export function modelSetObject(
    targetSchema,
    targetModel,
    targetKey,
    schema,
    model
) {
    if (isRequired(targetSchema, targetKey) || isSaturated(model)) {
        const nextModel = {
            ...targetModel,
            [targetKey]: assertType(schema, model),
        };
        return nextModel;
    } else {
        const { [targetKey]: _removed, ...nextModel } = targetModel;
        return nextModel;
    }
}
export function modelDrop(targetSchema, targetModel, targetKey) {
    const preferredType = getPreferredType(targetSchema.type);
    if (preferredType === 'array') {
        const prefix = targetModel.slice(0, targetKey);
        const suffix = targetModel.slice(targetKey + 1);

        // pad any missing elements up to where the target is being inserted
        while (prefix.length < targetKey) {
            prefix.push(
                defaultForSchema(getNextSchema(targetSchema, prefix.length))
            );
        }

        // combine into a new model and apply schema fixes
        return assertType(targetSchema, prefix.concat(suffix));
    } else if (preferredType === 'object') {
        const { [targetKey]: _removed, ...nextModel } = targetModel;
        return assertType(targetSchema, nextModel);
    }
}
export function modelSet(targetSchema, targetModel, targetKey, schema, model) {
    const preferredType = getPreferredType(targetSchema.type);
    if (preferredType === 'array') {
        return modelSetArray(
            targetSchema,
            targetModel,
            targetKey,
            schema,
            model
        );
    } else if (preferredType === 'object') {
        return modelSetObject(
            targetSchema,
            targetModel,
            targetKey,
            schema,
            model
        );
    } else {
        return assertType(schema, model);
    }
}

export function getTypeOf(schema, value) {
    if (value === undefined) return getPreferredType(schema.type);
    else if (value === null) return 'null';
    else if (Array.isArray(value)) return 'array';
    else return typeof value;
}
export function getPreferredType(types) {
    const ignoredTypes = new Set(['null']);

    let index = 0;

    if (!Array.isArray(types)) return types;

    // Skip ignored types
    while (ignoredTypes.has(types[index])) index++;

    // If we've run past the end, just use the first type
    if (index >= types.length) index = 0;

    return types[index];
}
export function defaultForSchema(schema) {
    if (schema.default !== undefined) {
        return schema.default;
    }

    return buildSchema(schema);

    function buildSchema(schema) {
        const type = getPreferredType(schema.type);
        let base = undefined;
        switch (type) {
            case 'array':
                base = [];
                if (Array.isArray(schema.items)) {
                    for (const item of schema.items) {
                        base.push(defaultForSchema(item));
                    }
                }
                break;
            case 'object':
                const required = schema.required || [];
                base = {};
                for (const property of required) {
                    const item = defaultForSchema(schema.properties[property]);
                    base[property] = item;
                }
                break;
            case 'string':
                base = '';
                break;
            case 'number':
                base = 0.0;
                break;
            case 'integer':
                base = 0;
                break;
            case 'boolean':
                base = false;
                break;
            case 'null':
                base = null;
                break;
            default:
                // throw new Error(`Unhandled defaultForSchema type: ${type}`);
                base = undefined;
        }

        return assertType(schema, base);
    }
}
export function getNextValue(schema, value, key) {
    const nextSchema = getNextSchema(schema, key);
    if (value[key] === undefined) {
        return defaultForSchema(nextSchema);
    }
    return assertType(nextSchema, value[key]);
}
export function getNextSchema(schema, key) {
    const preferredType = getPreferredType(schema.type);
    if (preferredType === 'array') {
        if (Array.isArray(schema.items)) {
            if (Number.isInteger(key) && key < schema.items.length) {
                return schema.items[key];
            } else {
                throw Error(`disallowed tuple index: ${key}`);
            }
        } else {
            return schema.items;
        }
    } else if (preferredType === 'object') {
        if (key in schema.properties) {
            return schema.properties[key];
        } else if (schema.additionalProperties) {
            return schema.additionalProperties;
        } else {
            throw Error(`disallowed object key: ${key}`);
        }
    } else {
        throw Error(`untraversable schema type: ${schema.type}`);
    }
}
export function getNext(schema, key, value) {
    const preferredType = getPreferredType(schema.type);
    if (preferredType === 'array') {
        if (Array.isArray(schema.items)) {
            if (Number.isInteger(key) && key < schema.items.length) {
                const nextSchema = schema.items[key];
                const nextValue = assertType(nextSchema, value[key]);
                return [nextSchema, nextValue];
            } else {
                throw Error(`disallowed tuple index: ${key}`);
            }
        } else {
            const nextSchema = schema.items;
            const nextValue = assertType(nextSchema, value[key]);
            return [nextSchema, nextValue];
        }
    } else if (preferredType === 'object') {
        if (key in schema.properties) {
            const nextSchema = schema.properties[key];
            const nextValue = assertType(nextSchema, value[key]);
            return [nextSchema, nextValue];
        } else if (schema.additionalProperties) {
            const nextSchema = schema.additionalProperties;
            const nextValue = assertType(nextSchema, value[key]);
            return [nextSchema, nextValue];
        } else {
            throw Error(`disallowed object key: ${key}`);
        }
    } else {
        throw Error(`untraversable schema type: ${schema.type}`);
    }
}
export function assertType(schema, value) {
    const preferred = getPreferredType(schema.type);
    const allowed = new Set(
        Array.isArray(schema.type) ? schema.type : [schema.type]
    );
    const type = getTypeOf(schema, value);

    if (allowed.has('null') && !value) {
        return null;
    } else if (preferred === 'integer') {
        if (allowed.has(type)) {
            return value;
        } else {
            if (type === 'number' && Number.isInteger(value)) return value;
            else if (type === 'number') return Math.floor(value);
            else if (value === '') return value;
            else if (value === '-') return value;
            else if (type === 'string') return parseInt(value);
            else return defaultForSchema(schema);
        }
    } else if (preferred === 'number') {
        if (allowed.has(type)) {
            return value;
        } else if (type === 'string') {
            if (value === '') return value;
            else if (value === '-') return value;
            else if (/\.$/.test(value) && !/^[^.]+\.[^.]+\.$/.test(value)) {
                return value;
            } else return parseFloat(value);
        } else {
            return defaultForSchema(schema);
        }
    } else if (preferred === 'string' && type === 'number') {
        return value.toString();
    } else if (preferred != type && value === undefined) {
        return defaultForSchema(schema);
    } else if (allowed.has(type)) {
        return value;
    } else {
        return defaultForSchema(schema);
    }
}
export function isRequired(schema, key) {
    if (schema.required) {
        return schema.required.includes(key);
    } else {
        return false;
    }
}
export function isSaturated(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    } else if (typeof value === 'object') {
        if (value === null) {
            return false;
        } else {
            return Object.keys(value).length > 0;
        }
    } else {
        return value !== undefined;
    }
}

export function seek(schema, key, model, stack) {
    let index = 0;
    let currentKey = undefined;
    let currentModel = model;
    let currentSchema = schema;

    while (index < key.length) {
        if (!currentModel) {
            currentModel = defaultForSchema(currentSchema);
        }

        stack.push([currentKey, currentModel, currentSchema]);

        currentKey = key[index++];
        [currentSchema, currentModel] = getNext(
            currentSchema,
            currentKey,
            currentModel
        );
    }

    return [currentKey, currentModel, currentSchema];
}
export function unwind(schema, key, model, stack, drop = 0) {
    let currentKey = key;
    let currentModel = model;
    let currentSchema = schema;

    while (stack.length > 0) {
        const [parentKey, parentModel, parentSchema] = stack.pop();
        if (drop) {
            drop--;
            currentModel = modelDrop(parentSchema, parentModel, currentKey);
        } else {
            currentModel = modelSet(
                parentSchema,
                parentModel,
                currentKey,
                currentSchema,
                currentModel
            );
        }
        currentSchema = parentSchema;
        currentKey = parentKey;
    }

    return currentModel;
}
