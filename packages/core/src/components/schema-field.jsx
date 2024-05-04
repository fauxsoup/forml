import debug from 'debug';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useActionsFor, useMappedField, useModelFor } from '@forml/hooks';
import { FormType } from '../types';

const log = debug('forml:core:schema-field');

function FieldRenderer(props) {
    const { Field, ...forwardProps } = props;
    return <Field {...forwardProps} />;
}

function ValueField(props) {
    const { form, parent, onChange } = props;

    const Field = useMappedField(form.type);
    const field = useModelFor(form.key);
    const actions = useActionsFor(form.key);

    const onChangeSet = useCallback(
        (event, value) => {
            const nextModel = actions.setValue(value);
            if (props.onChange) {
                props.onChange(event, nextModel);
            }
        },
        [props.onChange]
    );

    const error = useMemo(
        function() {
            if (field.model) {
                return field.validate(field.model)
            } else {
                return null;
            }
        },
        [field.model, field.validate]
    );

    if (!Field) {
        log(
            'ValueField.fail(key: %o, form: %o) : !Field : form : %o',
            form.key,
            form
        );
        return null;
    }

    return (
        <FieldRenderer
            Field={Field}
            form={form}
            path={field.path}
            schema={field.schema}
            value={field.model}
            onChangeSet={onChangeSet}
            error={error}
            parent={parent}
            onChange={onChange}
        />
    );
}

function WrapperField(props) {
    const { form, parent, onChange } = props;
    const Field = useMappedField(form.type);

    if (!Field) {
        log('WrapperField.fail(key: %o, form: %o)', form.key, form);
        return null;
    }

    return <Field form={form} parent={parent} onChange={onChange} />;
}

export function SchemaField(props) {
    const { form } = props;

    const Component = useMemo(
        () => ('key' in form ? ValueField : WrapperField),
        [form.key]
    );

    return <Component {...props} />;
}

SchemaField.propTypes = {
    schema: PropTypes.object,
    form: FormType,
};
SchemaField.defaultProps = {
    schema: { type: 'null' },
    form: {},
};
