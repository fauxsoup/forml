import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Input from '@mui/material/Input';
import React, { useCallback, useMemo } from 'react';
import { usePickerUtils } from './date-utils';

const sx = {
    mt: 2,
    mb: 1,
    '& .MuiInputBase-input': { p: 1, pr: 0 }
};

export default function Date(props) {
    const { form, value } = props;
    const utils = usePickerUtils();

    const settings = useMemo(
        () => ({
            fullWidth: 'fullWidth' in form ? form.fullWidth : true,
            disablePast: 'disablePast' in form ? form.disablePast : false,
            disableFuture: 'disableFuture' in form ? form.disableFuture : false,
            variant: 'variant' in form ? form.variant : 'inline',
            autoOk: 'autoOk' in form ? form.autoOk : true,
            openTo: 'openTo' in form ? form.openTo : 'day',
            format: 'format' in form ? form.format : undefined,
            disabled: 'readonly' in form ? form.readonly : false,
            disableMaskedInput: true,
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
        [value, props.onChange, settings.format]
    );

    return (
        <DatePicker
            value={utils.date(value)}
            onChange={onChange}
            renderInput={renderInput}
            sx={sx}
            {...settings}
            {...otherProps}
        />
    );
}
