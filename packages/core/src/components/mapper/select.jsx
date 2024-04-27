import ObjectPath from 'objectpath';
import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Select
 */
export default function Select(props) {
    const { form, schema, error, value } = props;

    const deco = useDecorator();
    const localizer = useLocalizer();

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

    const { title, placeholder, description } = useMemo(
        () => ({
            title: localizer.getLocalizedString(form.title),
            placeholder: localizer.getLocalizedString(form.placeholder),
            description: localizer.getLocalizedString(form.description),
        }),
        [localizer, form.title, form.placeholder, form.description]
    );

    const onChange = useCallback(
        function onChange(event) {
            props.onChangeSet(event, event.target.value);
        },
        [props.onChange]
    );

    const menuItems = useMemo(
        function() {
            const menuItems = [];
            for (let i = 0; i < form.titleMap.length; i++) {
                const name = localizer.getLocalizedString(
                    getLabel(form.titleMap[i])
                );
                const key = ObjectPath.stringify([...form.key, i]);
                const { value } = form.titleMap[i];
                menuItems.push(
                    <deco.Input.Option key={key} value={value}>
                        {name}
                    </deco.Input.Option>
                );
            }
            return menuItems;
        },
        [form.titleMap, form.key, value, localizer]
    );

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
                value={value}
                placeholder={placeholder}
                disabled={form.readonly}
                onChange={onChange}
                form={form}
                error={error}
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

Select.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.string,
};
