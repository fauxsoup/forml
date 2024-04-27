import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import debug from 'debug';
import { createRoot } from 'react-dom/client';
import ReactPDF from '@react-pdf/renderer';
import Page from './components/Page';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import React from 'react';

import 'material-icons/iconfont/material-icons.css';

const theme = createTheme();

// ReactPDF.Font.register({
//     family: 'Material Icons',
//     src: MaterialIcons,
//     fontStyle: 'normal',
// });
// ReactPDF.Font.register({
//     family: 'Roboto',
//     fonts: [
//         {
//             src: Roboto,
//             fontWeight: 'normal',
//             fontStyle: 'normal',
//         },
//         {
//             src: RobotoBold,
//             fontWeight: 'bold',
//             fontStyle: 'normal',
//         },
//         {
//             src: RobotoLight,
//             fontWeight: 'light',
//             fontStyle: 'normal',
//         },
//     ],
// });

const log = debug('forml:example');

async function loadPrism() {
    await import('prismjs/components/prism-clike');
    await import('prismjs/components/prism-javascript');
}

async function init() {
    await loadPrism();

    const root = createRoot(document.getElementById('app'));
    root.render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        html: {
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100vw',
                            height: '100vh',
                            overflow: 'hidden',
                        },
                        body: {
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100vw',
                            height: '100vh',
                            overflow: 'hidden',
                        },
                        '#app': {
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: '1',
                            maxHeight: 'fill-available',
                            maxWidth: 'fill-available',
                            overflow: 'hidden',
                        },
                    }}
                />
                <Page />
            </LocalizationProvider>
        </ThemeProvider>
    );
}

document.addEventListener('DOMContentLoaded', init);
