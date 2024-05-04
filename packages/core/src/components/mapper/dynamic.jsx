import React from 'react';
import { SchemaRender } from '../schema-render';

export default function Dynamic(props) {
    const { form: parent, onChange } = props;
    const form = parent.generate;

    return (
        <SchemaRender
            form={form}
            prefix={parent.key}
            onChange={onChange}
        />
    );
};
