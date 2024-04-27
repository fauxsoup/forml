import debug from 'debug';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import React, { forwardRef, memo, useMemo } from 'react';

const log = debug('forml:decorator-mui:arrays:item');

const DragHandle = (props) => (
    <Box {...props} sx={{ display: 'flex', flexDirection: 'column', p: 1.5 }}>
        <Icon>drag_handle</Icon>
    </Box>
);
const FormsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: theme.palette.divider,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    padding: theme.spacing(1),
}));
const Controls = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    '&:has(button:only-child)': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
}));
const Spacer = styled('div')(({ theme }) => ({
    flex: '1 0 auto',
    width: 'fill-available',
    borderBottom: `1px solid ${theme.palette?.divider}`,
}));
function OnlyDestroy(props) {
    const { onClick, disabled } = props;
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            color="secondary"
            size="small"
            sx={useMemo(
                () => ({
                    display: 'inline-flex !important',
                    flexDirection: 'column',
                    width: (theme) => theme.spacing(6),
                    minWidth: (theme) => theme.spacing(6),
                    border: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }),
                []
            )}
        >
            <Icon>delete_forever</Icon>
        </Button>
    );
}
function Destroy(props) {
    const { onClick, disabled } = props;
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            color="secondary"
            size="small"
            sx={useMemo(
                () => ({
                    width: (theme) => theme.spacing(6),
                    minWidth: (theme) => theme.spacing(6),
                }),
                []
            )}
        >
            <Icon>delete_forever</Icon>
        </Button>
    );
}
const MovementButton = styled(Button, {
    shouldForwardProp: (prop) => !['spacer'].includes(prop),
})(({ theme, spacer }) => ({
    borderRadius: '0',
    width: theme.spacing(6),
    minWidth: theme.spacing(6),
    borderBottom: spacer ? 'none !important' : undefined,
}));
const StyledListItem = forwardRef(function StyledListItem(props, ref) {
    return (
        <ListItem
            {...props}
            ref={ref}
            sx={useMemo(
                () => ({
                    display: 'flex',
                    alignItems: 'stretch',
                    flexDirection: 'row',
                    paddingTop: 0,
                    paddingBottom: 0,
                    backgroundColor: 'background.paper',
                }),
                []
            )}
        />
    );
});

/**
 * @component
 * @return {React.Component}
 */
export const ItemComponent = function ItemComponent(props, ref) {
    const { disabled, form, draggableProps, dragHandleProps } = props;
    const { moveUp, moveDown, destroy } = props;

    const renderMovementButtons = useMemo(
        () => ('movementButtons' in form ? form.movementButtons : true),
        [form]
    );
    const DestroyButton = useMemo(
        () => (renderMovementButtons ? Destroy : OnlyDestroy),
        [renderMovementButtons]
    );

    return (
        <StyledListItem
            divider={true}
            ref={ref}
            dense
            disableGutters={true}
            {...draggableProps}
        >
            <DragHandle {...dragHandleProps}></DragHandle>
            <FormsContainer>{props.children}</FormsContainer>
            <Controls key="controls">
                <MovementButtons
                    moveUp={moveUp}
                    moveDown={moveDown}
                    disabled={disabled}
                    render={renderMovementButtons}
                />
                <DestroyButton onClick={destroy} disabled={disabled} />
            </Controls>
        </StyledListItem>
    );
};

function MovementButtons(props) {
    const { render, moveUp, moveDown, disabled } = props;
    if (render) {
        return (
            <>
                <MovementButton
                    onClick={moveUp}
                    size="small"
                    disabled={disabled}
                >
                    <Icon>keyboard_arrow_up</Icon>
                </MovementButton>
                <MovementButton
                    onClick={moveDown}
                    size="small"
                    disabled={disabled}
                    spacer
                >
                    <Icon>keyboard_arrow_down</Icon>
                </MovementButton>
                <Spacer />
            </>
        );
    } else {
        return null;
    }
}
export default forwardRef(ItemComponent);
