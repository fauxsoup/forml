import React, { forwardRef, useCallback, useMemo, useState } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';
import { SchemaField } from '../schema-field';

const Tab = forwardRef(function Tab(props, ref) {
    const { parent, index, activeIndex, activate } = props;
    const localizer = useLocalizer();
    const deco = useDecorator();
    const form = parent.tabs[index];
    const active = index === activeIndex;
    const raiseTab = useCallback(() => activate(index), [activate, index]);
    const title = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);
    return (
        <deco.Tabs.Tab
            key={`tab-${index}`}
            form={form}
            title={title}
            description={description}
            active={active}
            activate={raiseTab}
            parent={parent}
            ref={ref}
        />
    );
});

const Panel = forwardRef(function Panel(props, ref) {
    const { parent, index, activeIndex, onChange } = props;
    const deco = useDecorator();
    const form = parent.tabs[index];
    const activeDelta = index - activeIndex;
    const { schema } = form;
    return (
        <deco.Tabs.Panel
            key={`panel-${index}`}
            form={form}
            parent={parent}
            activeDelta={activeDelta}
            ref={ref}
        >
            <SchemaField form={form} schema={schema} onChange={onChange} />
        </deco.Tabs.Panel>
    );
});

/**
 * @component Tabs
 */
export default function Tabs(props) {
    const [value, setValue] = useState(0);
    const { form } = props;
    const deco = useDecorator();
    const localizer = useLocalizer();

    const title = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);
    const [tabs, panels] = useMemo(() => {
        const tabs = [];
        const panels = [];
        for (let index = 0; index < form.tabs.length; ++index) {
            tabs.push(
                <Tab
                    parent={form}
                    index={index}
                    activeIndex={value}
                    activate={setValue}
                />
            );
            panels.push(
                <Panel parent={form} index={index} activeIndex={value} />
            );
        }
        return [tabs, panels];
    }, [form, value]);

    return (
        <deco.Tabs.Container
            className={form.htmlClass}
            form={form}
            value={value}
            tabs={tabs}
            panels={panels}
            title={title}
            description={description}
        />
    );
}

Tabs.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
};
