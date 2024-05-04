import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import React, { useMemo } from 'react';

/**
 * @component
 */
const Root = styled(List)(({ theme, disablePadding }) => [
    {
        flexDirection: 'column',
        flexGrow: 1,
    },
]);
const Content = styled(
    Box,
    {
        shouldForwardProp: (prop) =>
            !['disablePadding', 'layout', 'alignItems'].includes(prop)
    })(
        ({ theme, disablePadding, layout, alignItems }) => [
            {
                display: 'flex',
                flexDirection: layout === 'vertical' ? 'column' : 'row',
                padding: theme.spacing(1),
                gap: theme.spacing(1),
                alignItems: alignItems,
            },
            disablePadding && {
                padding: 0,
            },
        ]);
const Surface = styled(Paper)(({ theme, disableMargin }) => [
    {
        flex: 1,
        flexDirection: 'inherit',
        m: 1,
    },
    disableMargin && { m: 0 },
]);
const Title = styled(ListItem)(({ theme }) => ({}));

export default function FieldSet(props) {
    const { title, description, form } = props;

    const settings = useMemo(
        () => ({
            alignItems: 'alignItems' in form ? form.alignItems : undefined,
            layout: 'layout' in form ? form.layout : 'vertical',
            showTitle: 'showTitle' in form ? form.showTitle : true,
            disablePadding:
                'disablePadding' in form ? form.disablePadding : false,
            Component: 'component' in form ? form.component : 'div',
            elevation: 'elevation' in form ? form.elevation : 1,
            icon: 'icon' in form ? form.icon : null,
        }),
        [form]
    );
    const titleIcon = useMemo(
        () =>
            settings.icon ? (
                <ListItemIcon>
                    <Icon key="icon">{settings.icon}</Icon>
                </ListItemIcon>
            ) : null,
        [settings.icon]
    );
    const titleComponent = useMemo(() => {
        (title || description) && settings.showTitle && (
            <Title disablePadding={settings.disablePadding} divider>
                {titleIcon}
                <ListItemText
                    key="title"
                    primary={title}
                    primaryTypographyProps={{ noWrap: true }}
                    secondary={description}
                    secondaryTypographyProps={{
                        nowrap: true,
                        variant: 'caption',
                    }}
                />
            </Title>
        );
    }, [title, titleIcon, description, settings]);

    const content = useMemo(
        () => (
            <Root dense disablePadding>
                {titleComponent}
                <Content
                    layout={settings.layout}
                    component={settings.Component}
                    disablePadding={settings.disablePadding}
                    alignItems={settings.alignItems}
                >
                    {props.children}
                </Content>
            </Root>
        ),
        [titleComponent, settings, props.children]
    );

    return useMemo(() => {
        if (title || description) {
            return <Surface elevation={settings.elevation}>{content}</Surface>;
        } else {
            return content;
        }
    }, [title, description, content]);
}
