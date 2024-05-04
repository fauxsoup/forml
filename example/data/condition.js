const debug = require('debug');
const { useMemo } = require('react');
const { useValue } = require('@forml/hooks');

const log = debug('forml:example:condition');

module.exports = {
    formId: 'com.networknt.light.user.address',
    schema: {
        type: 'object',
        required: ['delivery'],
        title: 'Address',
        properties: {
            delivery: {
                title: 'Select delivery option',
                type: 'string',
            },
            firstName: {
                title: 'First Name',
                type: 'string',
            },
            lastName: {
                title: 'Last Name',
                type: 'string',
            },
            apartmentSuiteNumber: {
                title: 'Apartment/Suite Number',
                type: 'string',
            },
            address: {
                title: 'Address',
                type: 'string',
            },
            city: {
                title: 'City',
                type: 'string',
                description: 'Please enter full city name',
            },
            province: {
                title: 'Province',
                type: 'string',
                enum: [
                    'AB',
                    'BC',
                    'MB',
                    'NB',
                    'NF',
                    'NS',
                    'NT',
                    'NU',
                    'ON',
                    'PE',
                    'QC',
                    'SK',
                    'YK',
                ],
            },
            postalCode: {
                title: 'Postal Code',
                type: 'string',
            },
            country: {
                title: 'Country',
                type: 'string',
                enum: ['Canada'],
            },
            phone: {
                title: 'Phone',
                type: 'string',
                description: 'Please include area code',
            },
            pickupAddress: {
                title: 'Select a pickup address',
                type: 'string',
            },
        },
    },
    form: [
        {
            key: 'delivery',
            type: 'select',
            titleMap: [
                {
                    value: 'S',
                    name: 'Shipping',
                },
                {
                    value: 'P',
                    name: 'Pickup',
                },
            ],
        },
        {
            type: 'dynamic',
            generate: () => {
                const delivery = useValue(['delivery']);
                log('generate(delivery: %o)', delivery);
                const items = useMemo(() => {
                    log('generate.items(delivery: %o)', delivery);
                    if (delivery === 'S') {
                        return [
                            'firstName',
                            'lastName',
                            'address',
                            'city',
                            'postalCode',
                            'phone',
                            'country',
                            'province',
                        ];
                    } else {
                        return [
                            {
                                key: 'pickupAddress',
                                type: 'select',
                                titleMap: [
                                    {
                                        value: 'address1',
                                        name: '22 Front Street, Toronto ON, P1P1P1',
                                    },
                                    {
                                        value: 'address2',
                                        name: '10 King Street, Mississauga ON, L1L1L1',
                                    },
                                ],
                            },
                        ];
                    }
                }, [delivery]);
                return items;
            },
        },
    ],
};
