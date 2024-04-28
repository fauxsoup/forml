import React, { useCallback, useMemo } from 'react';
import { useActionsFor } from '@forml/hooks';

import { useRenderingContext } from '@forml/hooks';

export default function makeDynamic(SchemaForm) {
    function GeneratedDynamic(props) {
        const { form: parent } = props;
        return <BaseDynamic {...props} parent={parent} form={parent.generate} />;
    }
    function StaticDynamic(props) {
        const { form: parent } = props;
        const form = parent.generate;
        return <BaseDynamic {...props} parent={parent} form={form} />;
    }
    function BaseDynamic(props) {
        const { form, parent, schema, value } = props;
        const actions = useActionsFor(parent.key);
        const ctx = useRenderingContext();
        const { decorator, mapper, localizer } = ctx;

        const onChange = useCallback(
            (event, value) => {
                const nextModel = actions.setValue(value);
                props.onChange(event, nextModel);
            },
            [props.onChange, actions]
        );

        return (
            <SchemaForm
                schema={schema}
                decorator={decorator}
                mapper={mapper}
                localizer={localizer}
                form={form}
                model={value}
                onChange={onChange}
                parent={parent}
            />
        );
    }
    return function Dynamic(props) {
        const { form } = props;
        const Component = useMemo(() => {
            if (typeof form.generate === 'function') {
                return GeneratedDynamic;
            } else {
                return StaticDynamic;
            }
        }, [form.generate]);

        return <Component {...props} />;
    };
}
