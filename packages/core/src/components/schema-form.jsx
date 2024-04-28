/**
 * @namespace forml.SchemaForm
 */
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ModelContext, RenderingContext } from '@forml/context';
import { createModelStore } from '@forml/hooks';
import { defaultLocalizer, getLocalizer } from '../localizer';
import { FormsType } from '../types';
import { SchemaRender } from './schema-render';

import { decoratorShape, defaultDecorator, getDecorator } from '../decorators';
import { defaultMapper, getMapper, mapperShape } from './mapper';

/**
 * @component SchemaForm
 * @description Renders a form from the provided schema, using the provided model as a value
 * and the provided forms as a guide.
 */
export function SchemaForm(props) {
    const {
        model,
        schema,
        form,
    } = props;
    //const validate = useCallback(util.useValidator(schema), [schema]);
    const mapper = useMemo(
        () => getMapper(props.mapper, SchemaForm),
        [props.mapper]
    );
    const decorator = useMemo(
        () => getDecorator(props.decorator),
        [props.decorator]
    );
    const localizer = useMemo(
        () => getLocalizer(props.localizer),
        [props.localizer]
    );
    const renderingContext = useMemo(() => ({ mapper, decorator, localizer }), [mapper, decorator, localizer]);
    const modelContext = useRef(createModelStore(schema, model)).current;

    return (
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelContext}>
                <SchemaRender form={form} onChange={props.onChange} />
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
}

SchemaForm.propTypes = {
    /**
     * The current value of the form
     */
    model: PropTypes.any,
    /**
     * The schema to build against
     */
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    /** The forms to render */
    form: PropTypes.oneOfType([PropTypes.func, FormsType]),
    /** A set of localization functions to use */
    localizer: PropTypes.shape({
        getLocalizedDate: PropTypes.func,
        getLocalizedNumber: PropTypes.func,
        getLocalizedString: PropTypes.func,
    }),
    /** The map of control components to be recognized by SchemaField in a form's type */
    mapper: mapperShape,
    /** The tree of decorative components used by control components to build forms */
    decorator: decoratorShape,
};

SchemaForm.defaultProps = {
    model: null,
    schema: { type: 'null' },
    form: ['*'],
    decorator: defaultDecorator(),
    localizer: defaultLocalizer(),
    mapper: defaultMapper(SchemaForm),
};
