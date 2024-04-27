import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import React, { memo, useMemo, forwardRef } from 'react';
import { useLocalizer, useLocalizedString } from '@forml/hooks';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) =>
        !['disablePadding', 'disableGutters'].includes(prop),
})(({ theme, ...props }) => ({
    margin: theme.spacing?.(1),
    flex: '1 1 auto',
    ...(props.disablePadding
        ? {
            marginTop: 0,
            marginBottom: 0,
        }
        : {}),
    ...(props.disableGutters
        ? {
            marginLeft: 0,
            marginRight: 0,
        }
        : {}),
}));
const StyledList = forwardRef((props, ref) => (
    <List
        {...props}
        ref={ref}
        htmlname="items"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
        }}
    />
));

/**
 * @component
 */
function Items(props, ref) {
    const { title, form, otherProps } = props;
    const { error, description } = props;
    const { value, disabled } = props;

    const localizer = useLocalizer();
    const color = useMemo(() => (error ? 'error' : 'info'), [error]);

    const paperProps = useMemo(
        () => ({
            disablePadding:
                'disablePadding' in form ? form.disablePadding : false,
            disableGutters:
                'disableGutters' in form ? form.disableGutters : false,
        }),
        [form]
    );
    const addText = useMemo(
        () =>
            'addText' in form
                ? localizer.getLocalizedString(form.addText)
                : title
                    ? `${localizer.getLocalizedString('Add')} ${title}`
                    : localizer.getLocalizedString('Add'),
        [form, localizer, title]
    );

    const suffix = useMemo(
        () => (value && value.length === 0 ? <Empty /> : null),
        [value]
    );

    return (
        <StyledPaper {...paperProps}>
            <StyledList disablePadding dense ref={ref} {...otherProps}>
                <Header
                    add={props.add}
                    icon={form.icon}
                    color={color}
                    addText={addText}
                    disabled={disabled}
                    title={title}
                    error={error}
                    description={description}
                />
                {props.children}
                {suffix}
            </StyledList>
        </StyledPaper>
    );
}

const emptyTypographProps = { align: 'center' };
function Empty(props) {
    return (
        <ListItem divider>
            <ListItemText
                secondary={useLocalizedString('empty')}
                secondaryTypographyProps={emptyTypographProps}
            />
        </ListItem>
    );
}
function AddButton(props) {
    const { onClick, color, disabled, children } = props;
    return (
        <Button
            onClick={onClick}
            color={color}
            edge="end"
            startIcon={<Icon>add</Icon>}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}

function HeaderTitle(props) {
    const { color, primary, secondary } = props;
    return (
        <ListItemText
            key="text"
            primaryTypographyProps={useMemo(
                () => ({ color, variant: 'subtitle2' }),
                [color]
            )}
            primary={primary}
            secondary={secondary}
        />
    );
}

function HeaderIcon(props) {
    const { color, children } = props;
    return (
        <ListItemIcon key="icon" edge="start">
            <Icon color={color}>{children}</Icon>
        </ListItemIcon>
    );
}
function Header(props) {
    const { color, icon, title, error, description, addText, disabled } = props;
    return (
        <ListItem key="title" dense={false} divider>
            <HeaderIcon color={color}>{icon ?? 'view_list'}</HeaderIcon>
            <HeaderTitle
                primary={title}
                secondary={error || description}
                color={color}
            />
            <AddButton onClick={props.add} color={color} disabled={disabled}>
                {addText}
            </AddButton>
        </ListItem>
    );
}
export default forwardRef(Items);
