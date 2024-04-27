import t from 'prop-types';
import React, { useCallback } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Date
 */
export default function Date(props) {
    const localizer = useLocalizer();
    const deco = useDecorator();

    let { value, form, error } = props;
    let { title, description, placeholder } = form;
    const { readonly: disabled } = form;
    const onChange = useCallback(
        function onChange(e) {
            props.onChangeSet(e, e.target.value);
        },
        [props.onChange]
    );

    /**
     * Apply localizations
     */
    error = localizer.getLocalizedString(error);
    title = localizer.getLocalizedString(title);
    description = localizer.getLocalizedString(description);
    placeholder = localizer.getLocalizedString(placeholder);

    return (
        <deco.Input.Group form={form} value={value} error={error}>
            {title && (
                <deco.Label key="label" form={form} value={value} error={error}>
                    {title}
                </deco.Label>
            )}
            <deco.Input.Form
                key="form"
                type="date"
                onChange={onChange}
                form={form}
                value={value}
                error={error}
                placeholder={placeholder}
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

Date.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string,
};
