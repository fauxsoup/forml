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
    return <>
        {useMemo(() =>
            keys.map(
                (key, offset) => <Item
                    key={key}
                    id={key}
                    onChange={onChange}
                    form={form}
                    parent={form}
                    index={start + offset}
                    forms={form.items}
                    type={type}
                />
            ),
            [keys, onChange, form]
        )}
    </>;
}

/**
 *  <Item
 *      key={key}
 *      {...array}
 *      id={key}
 *      forms={parent.items}
 *      index={index}
 *      form={form}
 *      parent={parent}
 *      type={type}
 *      schema={schema}
 *      onChange={onChange}
 *      value={array.model[index]}
 *  />
 */
