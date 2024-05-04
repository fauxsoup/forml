import React, { useMemo } from 'react';
import { SchemaRender } from '../schema-render';
import { useRenderingContext, usePrefixed } from '@forml/hooks';
import { RenderingContext } from '@forml/context';

export default function Dynamic(props) {
    const { form: parent, onChange } = props;
    const parentContext = useRenderingContext();
    const prefix = usePrefixed(parent.key);
    const form = parent.generate;

    const context = useMemo(() => ({
        ...parentContext,
        prefix
    }), [parentContext, prefix]);

    return (
        <RenderingContext.Provider value={context}>
            <SchemaRender
                form={form}
                onChange={onChange}
            />
        </RenderingContext.Provider>
    );
};
