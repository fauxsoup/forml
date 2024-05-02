import debug from 'debug';
import React, { useMemo } from 'react';
import { useArrayKeyRange } from '@forml/hooks';
import ObjectPath from 'objectpath';

import { Item } from './Item';

const log = debug('forml:core:array:range');

export function Range(props) {
    const { start, end, form, onChange } = props;
    const keys = useArrayKeyRange(start, end);
    const type = useMemo(() => ObjectPath.stringify(form.key), [form.key]);
    const items = useMemo(() =>
        keys.map(
            (key, offset) => (
                <Item
                    key={key}
                    id={key}
                    onChange={onChange}
                    form={form}
                    parent={form}
                    index={start + offset}
                    forms={form.items}
                    type={type}
                />
            )
        ),
        [keys, onChange, form]
    );
    return <>
        {items}
    </>;
}
