import t from 'prop-types';
import ObjectPath from 'objectpath';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

const valueExceptions = ['', '-'];
const valueReplacements = { '0-': '-' };

/**
 * @component Integer
 */
export default function Integer(props) {
    const { value, form, error } = props;

    const deco = useDecorator();
    const localizer = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label = localizer.getLocalizedString(
        form.title || form.key[form.key.length - 1]
    );
    const description = localizer.getLocalizedString(form.description);
    const id = useMemo(() => ObjectPath.stringify(form.key), [form.key]);
    const onChange = useCallback(
        function onChange(e) {
            let value = e.target.value;

            if (value in valueReplacements) {
                props.onChangeSet(e, valueReplacements[value]);
                return;
            } else if (valueExceptions.includes(value)) {
                props.onChangeSet(e, value);
                return;
            }

            value = parseInt(value);

            if (isNaN(value)) {
                e.preventDefault();
                return;
            }

            props.onChangeSet(e, value);
        },
        [props.onChangeSet]
    );

    return (
        <deco.Input.Group form={form}>
            {label && (
                <deco.Label
                    key="label"
                    htmlfor={id}
                    form={form}
                    value={value}
                    error={error}
                >
                    {label}
                </deco.Label>
            )}
            <deco.Input.Form
                key="input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={id}
                form={form}
                error={error}
            />
            {(error || description) && (
                <deco.Input.Description
                    key="description"
                    form={form}
                    value={value}
                    error={!!error}
                >
                    {error || description}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );
}

Integer.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.number,
};
