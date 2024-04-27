import ObjectPath from 'objectpath';
import t from 'prop-types';
import React, { useMemo, useCallback } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

const valueExceptions = ['', '-'];

/**
 * @component Number
 */
export default function Number(props) {
    const { form, value, error } = props;
    const { readonly: disabled } = form;

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

            if (valueExceptions.includes(value)) {
                props.onChange(e, value);
                return;
            }

            const appendPoint = /^[0-9]+\.+$/.test(value);

            value = parseFloat(value);

            if (isNaN(value)) {
                e.preventDefault();
                return;
            }

            if (appendPoint) value = `${value}.`;

            props.onChangeSet(e, value);
        },
        [props.onChangeSet]
    );

    return (
        <deco.Input.Group key={id} form={form}>
            {label && (
                <deco.Label
                    key="label"
                    form={form}
                    value={value}
                    error={error}
                    htmlfor={id}
                >
                    {label}
                </deco.Label>
            )}
            <deco.Input.Form
                key="input"
                value={value}
                error={error}
                onChange={onChange}
                placeholder={placeholder}
                form={form}
                id={id}
                disabled={disabled}
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

Number.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the number */
    value: t.number,
};
