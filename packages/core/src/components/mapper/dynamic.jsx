import debug from 'debug';
import React, { useMemo } from 'react';

import { useRenderingContext } from '@forml/hooks';

const log = debug('forml:core:dynamic');

export default function makeDynamic(SchemaForm) {
    function GeneratedDynamic(props) {
        const { form: parent, value } = props;
        const form = parent.generate(value);
        return <BaseDynamic {...props} parent={parent} form={form} />;
    }
    function StaticDynamic(props) {
        const { form: parent } = props;
        const form = parent.generate;
        return <BaseDynamic {...props} parent={parent} form={form} />;
    }
    function BaseDynamic(props) {
        const { form, parent, value } = props;
        const ctx = useRenderingContext();
        const { decorator, mapper, localizer } = ctx;

        return (
            <SchemaForm
                {...props}
                decorator={decorator}
                mapper={mapper}
                localizer={localizer}
                form={form}
                model={value}
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
