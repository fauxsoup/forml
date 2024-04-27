import t from 'prop-types';
import React, { useMemo } from 'react';
import debug from 'debug';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';
import { SchemaField } from '../schema-field';

const log = debug('forml:core:fieldset');

/**
 * @component FieldSet
 */
export default function FieldSet(props) {
    const { form, onChange } = props;
    const localizer = useLocalizer();
    const title = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);
    const { readonly: disabled } = form;

    const parent = form;
    const forms = useMemo(
        () =>
            form.items.map(function(form, index) {
                const { schema } = form;
                const key = index.toString();
                return (
                    <SchemaField
                        form={form}
                        key={key}
                        onChange={onChange}
                        schema={schema}
                        parent={parent}
                    />
                );
            }),
        [form.items, onChange]
    );

    const deco = useDecorator();

    return (
        <deco.FieldSet
            form={form}
            title={title}
            description={description}
            disabled={disabled}
        >
            {forms}
        </deco.FieldSet>
    );
}

FieldSet.propTypes = {
    form: FormType,
    onChange: t.func,
    onChangeSet: t.func,
};
