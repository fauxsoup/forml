import { util } from '@forml/core';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card'; import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import useEditable from '../hooks/useEditable';
import { getSample } from '../samples';
import Editor from './Editor';
import RenderExample from './RenderExample';
import SelectDecorator from './SelectDecorator';
import SelectExample from './SelectExample';


function Title(props) {
    if (props.title) {
        return <Divider><Typography variant="caption">{props.title}</Typography></Divider>
    } else {
        return null;
    }
}

const miniBoxInnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 fit-content',
    padding: 1,
    gap: 1
};
const miniBoxOuterStyle = {
    display: 'grid',
    gridAutoRows: 'min-content',
}
function MiniBox(props) {
    return (
        <Box sx={miniBoxOuterStyle}>
            <Title title={props.title} />
            <Box sx={miniBoxInnerStyle}>{props.children}</Box>
        </Box>
    );
}

const maxiBoxOuterStyle = {
    display: 'grid',
    gridAutoRows: 'min-content auto',
    minHeight: '0',
}
const maxiBoxInnerStyle = {
    flex: '1 0 100%',
    overflowY: 'auto',
    p: 1,
    g: 1
};
function MaxiBox(props) {
    return (
        <Box sx={maxiBoxOuterStyle}>
            <Title title={props.title} />
            <Box sx={maxiBoxInnerStyle}>{props.children}</Box>
        </Box>
    );
}

export default function Page() {
    const pdfRef = useRef();
    const [selected, setSelected] = useState('');
    const [localizer, setLocalizer] = useState(undefined);
    const [decorator, setDecorator] = useState('mui');
    const [mapper, setMapper] = useState(undefined);
    const schema = useEditable({ type: 'null' });
    const form = useEditable(['*']);
    const defaultModel = useMemo(() => {
        return util.defaultForSchema(schema.value);
    }, [schema.value]);
    const model = useEditable(defaultModel);

    const onChange = useCallback(
        async function onChange(event, example) {
            // event.preventDefault();
            const sample = getSample(example);
            schema.setValue(sample.schema);
            form.setValue(sample.form);
            model.setValue(
                sample.model || util.defaultForSchema(sample.schema)
            );
            setMapper(sample.mapper);
            setLocalizer(sample.localization);
            setSelected(example);
        },
        [
            schema.setValue,
            form.setValue,
            model.setValue,
            setMapper,
            setLocalizer,
            setSelected,
        ]
    );

    const [finalForm, setFinalForm] = useState(null);
    const forwardForm = useMemo(() => {
        if (typeof form.value === 'function') {
            return (...args) => {
                const final = form.value(...args);
                setFinalForm(final);
                return final;
            }
        } else {
            setFinalForm(form.value);
            return form.value;
        }
    }, [form.value])
    const finalFormJSON = useMemo(() => JSON.stringify(finalForm, null, 2), [finalForm]);

    const onModelChange = useCallback(
        function onModelChange(event, ...args) {
            model.setValue(args[0]);
        },
        [model.setValue]
    );
    const onSchemaChange = useCallback(
        (e) => schema.setJSON(e.target.value),
        [schema.setJSON]
    );
    const onFormChange = useCallback(
        (e) => form.setJSON(e.target.value),
        [form.setJSON]
    );

    return (
        <Box display="grid" gridAutoFlow="column" gridAutoColumns="4fr min-content 1fr" height="fill-available" maxHeight="fill-available" overflow="hidden">
            <Box display="grid" gridAutoFlow="row" height="fill-available" gridAutoRows="2fr 1fr" gap={1} overflow="hidden" key="primary-viewport">
                <Box key="example" display="flex" flexDirection="column" overflow="hidden" minHeight={0}>
                    <Divider key="header"><Typography key="title" variant="caption">Rendered Example</Typography></Divider>
                    <Box overflow="auto" maxHeight="fill-available" p={1} key="editor">
                        <RenderExample
                            key={`render-${decorator}-${selected}`}
                            schema={schema.value}
                            form={forwardForm}
                            model={model.value}
                            onChange={onModelChange}
                            wrapInDocument={selected != './kitchenSink.js'}
                            mapper={mapper}
                            localizer={localizer}
                            decorator={decorator}
                        />
                    </Box>
                </Box>
                <Box key="model" display="flex" flexDirection="column" overflow="hidden">
                    <Divider><Typography key="title" variant="caption">Model</Typography></Divider>
                    <Box overflow="auto" maxHeight="fill-available" key="editor">
                        <Editor key="editor" value={model.json} />
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" />
            <Box display="grid" gridAutoFlow="row" gridAutoRows="min-content auto auto" overflow="hidden" key="secondary-viewport">
                <MiniBox key="configure-example" title="Configure Example">
                    <MiniBox key="select-example">
                        <SelectExample selected={selected} onChange={onChange} />
                    </MiniBox>
                    <MiniBox key="select-decorator">
                        <SelectDecorator
                            decorator={decorator}
                            onChange={setDecorator}
                        />
                    </MiniBox>
                </MiniBox>
                <MaxiBox key="schema" title="Schema">
                    <Editor
                        key="editor"
                        value={schema.json}
                        onChange={onSchemaChange}
                    />
                </MaxiBox>
                <MaxiBox key="form" title="Form">
                    <Editor
                        key="editor"
                        value={finalFormJSON}
                        onChange={onFormChange}
                    />
                </MaxiBox>
            </Box>
        </Box>
    );
}

/*
            <Stack sx={{ "flex": "1 0 auto", maxHeight: 'fill-available', overflow: 'hidden' }} key="primary-viewport">
                <Divider><Typography key="title" variant="caption">Rendered Example</Typography></Divider>
                <Box sx={{ flex: "1 1 auto", height: 'fill-available', maxHeight: 'fill-available' }} key="example" ref={pdfRef}>
                    <RenderExample
                        key={`render-${decorator}-${selected}`}
                        schema={schema.value}
                        form={forwardForm}
                        model={model.value}
                        onChange={onModelChange}
                        wrapInDocument={selected != './kitchenSink.js'}
                        mapper={mapper}
                        localizer={localizer}
                        decorator={decorator}
                    />
                </Box>
                <Divider><Typography key="title" variant="caption">Model</Typography></Divider>
                <Box sx={{ flex: '0 0 auto', height: 'fill-available', maxHeight: '15rem', overflowY: 'auto' }} key="model">
                    <Editor key="editor" value={model.json} />
                </Box>
            </Stack>
*/
