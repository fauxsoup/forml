import React, { useMemo, useCallback } from 'react';
import { SchemaForm } from '@forml/core';

import decorators from '../decorators';

export default function SelectDecorator(props) {
    const schema = useMemo(
        () => ({
            type: 'string',
            enum: Object.keys(decorators),
            enumNames: Object.keys(decorators),
        }),
        [decorators]
    );
    const form = useMemo(() => [{ key: [], title: 'Decorator' }], []);
    const onChange = useCallback(
        function onChange(event, nextModel) {
            props.onChange(nextModel);
        },
        [props.onChange]
    );
    const model = props.decorator;

    return (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            onChange={onChange}
            decorator={decorators.mui}
        />
    );
}
