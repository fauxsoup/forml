import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component DateTime
 */
export default function DateTime(props) {
    const localizer = useLocalizer();
    const deco = useDecorator();

    let { form, error } = props;
    let { title, description, placeholder } = form;
    const { readonly: disabled } = form;
    const value = useMemo(() => props.value || new Date().toISOString(), [props.value])
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
        <deco.Input.Group
            form={form}
            value={value}
            error={error}
            disabled={disabled}
        >
            {title && (
                <deco.Label
                    key="label"
                    form={form}
                    value={value}
                    error={error}
                    disabled={disabled}
                >
                    {title}
                </deco.Label>
            )}
            <deco.Input.Form
                key="form"
                type="datetime-local"
                onChange={onChange}
                form={form}
                value={value}
                error={error}
                disabled={disabled}
                placeholder={placeholder}
            />
            {(error || description) && (
                <deco.Input.Description
                    key="description"
                    form={form}
                    disabled={disabled}
                    value={value}
                    error={!!error}
                >
                    {error || description}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );
}

DateTime.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string,
};
