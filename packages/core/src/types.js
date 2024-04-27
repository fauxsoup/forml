import t from 'prop-types';

export const FormType = t.oneOfType([
    t.string,
    t.shape({
        key: t.arrayOf(t.oneOfType([t.string, t.number])),
        type: t.string,
    }),
]);
export const FormsType = t.arrayOf(
    function (propValue, key, componentName, location, propFullName) {
        const isString = typeof propValue[key] === 'string';
        const isObject =
            typeof propValue[key] === 'object' && propValue[key] !== null;

        if (!isString && !isObject) {
            return new Error(
                `Invalid prop \`${propFullName}\` of type \`${typeof propValue[key]}\` supplied to \`${componentName}\`, expected \`string\` or \`object\`.`
            );
        }
    }
);
FormType.items = FormsType;
