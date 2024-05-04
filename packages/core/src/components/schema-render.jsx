import React, { useMemo } from 'react';
import { useGenerator, useSchemaFor } from '@forml/hooks';

import { merge } from '../forms';
import { SchemaField } from './schema-field';

export function SchemaRender(props) {
    const schema = useSchemaFor(props.prefix);
    const form = useGenerator(props.form);
    const merged = useMemo(function() {
        return merge(schema, form, { prefix: props.prefix });
    }, [schema, form]);

    const children = useMemo(
        () =>
            merged.map((form, index) => {
                if (!form) return;
                const { schema } = form;
                return (
                    <SchemaField
                        key={index}
                        prefix={props.prefix}
                        schema={schema}
                        form={form}
                        onChange={props.onChange}
                    />
                );
            }),
        [merged, props.prefix, props.onChange]
    );

    return <>{children}</>
}

