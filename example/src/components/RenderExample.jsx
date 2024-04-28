import React, { useMemo } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { SchemaForm, util } from '@forml/core';
import shortid from 'shortid';

import ErrorBoundary from './ErrorBoundary';

import decorators from '../decorators';

export default function RenderExample(props) {
    const { schema, form, model } = props;
    const { onChange } = props;
    const { localizer } = props;
    const { mapper } = props;
    const { decorator } = props;
    const { wrapInDocument } = props;

    const key = useMemo(() => shortid(), [decorator]);

    let child = <SchemaForm
        schema={schema}
        form={form}
        model={model}
        decorator={decorators[decorator]}
        localizer={localizer}
        onChange={onChange}
        mapper={mapper}
    />;
    if (decorator === 'pdf') {
        if (wrapInDocument) {
            child = (
                <ReactPDF.Document>
                    <ReactPDF.Page size="A4">{child}</ReactPDF.Page>
                </ReactPDF.Document>
            );
        }
        child = (
            <ReactPDF.PDFViewer
                key={key}
                style={useMemo(() => ({ width: '100vw', height: '100vh' }), [])}
            >
                {child}
            </ReactPDF.PDFViewer>
        );
    }

    return <ErrorBoundary>{child}</ErrorBoundary>;
}
