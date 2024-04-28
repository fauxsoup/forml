import MuiSelect from '@mui/material/Select';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Select({
    error,
    onChange,
    value,
    placeholder,
    disabled,
    children,
    multiple,
}) {
    return (
        <MuiSelect
            error={!!error}
            onChange={onChange}
            value={value ?? ''}
            placeholder={placeholder}
            disabled={disabled}
            multiple={multiple}
        >
            {children}
        </MuiSelect>
    )
}
