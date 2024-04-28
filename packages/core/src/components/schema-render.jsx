import React, { useMemo } from 'react';
import { useSchema } from '@forml/hooks';

import { merge } from '../forms';
import { SchemaField } from './schema-field';

function useGenerator(generator) {
    if (typeof generator === 'function') {
        // The generator is a hook; use it
        return generator();
    } else {
        return generator;
    }
}

export function SchemaRender(props) {
    const schema = useSchema();
    const form = useGenerator(props.form);
    const merged = useMemo(function() {
        return merge(schema, form);
    }, [schema, form]);

    const children = useMemo(
        () =>
            merged.map((form, index) => {
                if (!form) return;
                const { schema } = form;
                return (
                    <SchemaField
                        key={index}
                        schema={schema}
                        form={form}
                        onChange={props.onChange}
                    />
                );
            }),
        [merged, props.onChange]
    );

    return <>{children}</>
}

