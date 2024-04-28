import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Input from '@mui/material/Input';
import React, { useCallback, useMemo } from 'react';
import { usePickerUtils } from './date-utils';

const sx = {
    mt: 2,
    mb: 1,
    '& .MuiInputBase-input': { p: 1, pr: 0 }
};

export default function DateTime(props) {
    const { value, form } = props;
    const utils = usePickerUtils();

    const settings = useMemo(
        () => ({
            fullWidth: 'fullWidth' in form ? form.fullWidth : true,
            disablePast: 'disablePast' in form ? form.disablePast : false,
            disableFuture: 'disableFuture' in form ? form.disableFuture : false,
            variant: 'variant' in form ? form.variant : 'dialog',
            autoOk: 'autoOk' in form ? form.autoOk : true,
            openTo: 'openTo' in form ? form.openTo : 'hours',
            format: 'format' in form ? form.format : undefined,
            disabled: 'readonly' in form ? form.readonly : false,
        }),
        [form]
    );
    const otherProps = useMemo(
        () => ('otherProps' in form ? form.otherProps : {}),
        [form]
    );
    const renderInput = useCallback(
        ({ InputProps, ...props }) => <Input {...props} {...InputProps} />,
        []
    );
    const onChange = useCallback(
        function onChange(value) {
            value = value
                ? settings.format
                    ? value.format
                        ? value.format(settings.format)
                        : value.toFormat
                            ? value.toFormat(settings.format)
                            : value.toLocaleString()
                    : value.toLocaleString()
                : value;
            if (props.onChange) {
                props.onChange({ target: { value } }, value);
            }
        },
        [value, props.onChange]
    );

    return (
        <DateTimePicker
            value={utils.date(value)}
            onChange={onChange}
            renderInput={renderInput}
            sx={sx}
            {...settings}
            {...otherProps}
        />
    );
}
