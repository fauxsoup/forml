import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

export default function Multiselect(props) {
    const { value, schema, error, form } = props;
    const { readonly: disabled } = form;

    const deco = useDecorator();
    const localizer = useLocalizer();

    const title = localizer.getLocalizedString(form.title);
    const placeholder = localizer.getLocalizedString(form.placeholder);
    const description = localizer.getLocalizedString(form.description);

    const getLabel = useCallback(
        function getLabel(item) {
            const { displayFn } = schema;

            if (displayFn) {
                return displayFn(item);
            }

            return item.name;
        },
        [schema]
    );

    const onChange = useCallback(
        function onChange(event) {
            props.onChangeSet(
                event,
                Array.from(event.target.selectedOptions).map(
                    (option) => option.value
                )
            );
        },
        [props.onChange]
    );

    const menuItems = useMemo(() => {
        const options = [];
        for (let i = 0; i < form.titleMap.length; i++) {
            const name = localizer.getLocalizedString(
                getLabel(form.titleMap[i])
            );
            const { value } = form.titleMap[i];
            options.push(
                <deco.Input.Option key={name} value={value}>
                    {name}
                </deco.Input.Option>
            );
            return options;
        }
    }, [form.titleMap, localizer]);

    return (
        <deco.Input.Group form={form} error={error}>
            {title && (
                <deco.Label
                    key="label"
                    required={form.required}
                    form={form}
                    value={value}
                    error={error}
                >
                    {title}
                </deco.Label>
            )}
            <deco.Input.Select
                key="select"
                multiple
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                form={form}
                error={error}
                disabled={disabled}
            >
                {menuItems}
            </deco.Input.Select>
            {(error || description) && (
                <deco.Input.Description
                    key="help"
                    error={!!error}
                    form={form}
                    value={value}
                >
                    {localizer.getLocalizedString(error || description)}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );
}

Multiselect.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.arrayOf(t.string),
};
