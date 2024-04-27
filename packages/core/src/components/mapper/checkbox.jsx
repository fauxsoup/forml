import t from 'prop-types';
import React, { useCallback } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Checkbox
 */
export default function Checkbox(props) {
    const { form } = props;
    const { error, value } = props;
    const { title, description } = form;
    const { readonly: disabled } = form;

    const deco = useDecorator();
    const localize = useLocalizer();
    const onChange = useCallback(
        function onChange(event) {
            props.onChangeSet(event, event.target.checked);
        },
        [props.onChange]
    );

    return (
        <deco.Checkbox
            form={form}
            checked={value}
            title={localize.getLocalizedString(title)}
            description={localize.getLocalizedString(description)}
            error={error}
            onChange={onChange}
            disabled={disabled}
        />
    );
}

Checkbox.propTypes = {
    schema: t.object,
    form: FormType,
    error: t.string,
    value: t.bool,
};
