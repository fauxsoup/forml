import debug from 'debug';
import PropTypes from 'prop-types';
import React, { memo, useMemo, useCallback } from 'react';
import isEqual from 'lodash/isEqual';

import { useMappedField, useActionsFor, useModelFor } from '@forml/hooks';
import { FormType } from '../types';

const log = debug('forml:schema-field');

const FieldRenderer = memo(
    function FieldRenderer(props) {
        const { Field, ...forwardProps } = props;
        return <Field {...forwardProps} />;
    },
    function arePropsEqual(oldProps, newProps) {
        return (
            oldProps.path === newProps.path &&
            (Object.is(oldProps.value, newProps.value) ||
                isEqual(oldProps.value, newProps.value))
        );
    }
);

function ValueField(props) {
    const { form, parent } = props;

    const Field = useMappedField(form.type);
    const field = useModelFor(form.key);
    const actions = useActionsFor(form.key);
        (event, value) => {
            const nextModel = actions.setValue(value);
            if (props.onChange) {
                props.onChange(event, nextModel);
            }
        },
        [props.onChange]
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
            onChange={onChange}
            //error={error}
            parent={parent}
        />
    );
}

function WrapperField(props) {
    const { form, parent } = props;
    const Field = useMappedField(form.type);

    if (!Field) {
        log('WrapperField.fail(key: %o, form: %o)', form.key, form);
        return null;
    }

    return <Field form={form} parent={parent} />;
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
