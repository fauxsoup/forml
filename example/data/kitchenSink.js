const comment = require('./comment');

module.exports = {
    schema: {
        type: 'object',
        title: 'Kitchen Sink test Schema Form',
        properties: {
            file: {
                title: 'File Selector',
                type: 'string',
            },
            textWithDefault: {
                title: 'Text with default',
                type: 'string',
                default: 'Default Value',
            },
            textNoDefault: {
                title: 'Text no default',
                type: 'string',
            },
            textWithRegex: {
                title: 'Text With Regex and Description',
                type: 'string',
                pattern: '^\\S+@\\S+$',
                description: 'General regex for email.',
            },
            staticDropdown: {
                type: 'string',
                title: 'Static Dropdown',
                enum: ['LOCAL', 'SIT1', 'SIT2', 'SIT3', 'UAT1', 'UAT2'],
            },
            textArea: {
                title: 'Text Area with Validation Message',
                type: 'string',
                maxLength: 20,
                validationMessage: "Don't be greedy!",
                description: 'Please write your comment here.',
            },
            helpMessage: {
                title: 'Help Message',
                type: 'string',
                description: 'This is the help value',
            },
            checkbox: {
                title: 'Checkbox',
                type: 'boolean',
            },
            date: {
                title: 'Date',
                type: 'string',
                format: 'date',
            },
            comment: comment.schema,
        },
        required: ['date', 'textWithRegex', 'comment'],
    },

    form: [
        {
            type: 'tabs',
            title: 'Settings',
            collapse: true,
            description: 'A multi-page example for your consideration',
            layout: 'horizontal',
            tabs: [
                {
                    type: 'fieldset',
                    title: 'Simple Keys',
                    description: 'Forms rendered without customization',
                    items: [
                        'textWithDefault',
                        'textNoDefault',
                        'textWithRegex',
                        'staticDropdown',
                        { key: 'file', type: 'file' },
                    ],
                },
                {
                    type: 'fieldset',
                    title: 'Full Forms',
                    description: 'Highly customized forms',
                    items: [
                        {
                            key: 'textArea',
                            type: 'textarea',
                            placeholder: 'Make a comment',
                        },
                        {
                            key: 'helpMessage',
                            type: 'help',
                        },
                        {
                            key: 'checkbox',
                            type: 'checkbox',
                        },
                        {
                            key: 'date',
                            type: 'date',
                        },
                        {
                            type: 'fieldset',
                            disableGutters: true,
                            disableMargin: true,
                            disablePadding: true,
                            elevation: 0,
                            items: [
                                {
                                    type: 'dynamic',
                                    key: ['comment'],
                                    generate: comment.form,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'fieldset',
                    title: 'Combo Forms',
                    description: 'Highly customized standard forms',
                    items: [
                        {
                            key: 'textArea',
                            type: 'textarea',
                            placeholder: 'Make a comment',
                        },
                        {
                            key: 'helpMessage',
                            variant: 'body2',
                            type: 'help',
                        },
                        'checkbox',
                        'date',
                        {
                            type: 'fieldset',
                            disableGutters: true,
                            disableMargin: true,
                            disablePadding: true,
                            elevation: 0,
                            items: [
                                {
                                    type: 'dynamic',
                                    key: ['comment'],
                                    generate: comment.form,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'fieldset',
                    title: 'Singular Field',
                    description:
                        'A single field to ensure heights are calculated correctly',
                    items: ['checkbox'],
                },
            ],
        },
    ],
};
