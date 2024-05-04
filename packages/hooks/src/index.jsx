import { ModelContext, RenderingContext } from '@forml/context';
import { useContext as useReactContext, useMemo } from 'react';

export * from './reducer';
export * from './model';
export * from './array';

export function useRenderingContext() {
    return useReactContext(RenderingContext);
}

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
    const { mapper } = useRenderingContext();
    return mapper;
}

export function useGenerator(generator) {
    if (typeof generator === 'function') {
        // The generator is a hook; use it
        return generator();
    } else {
        return generator;
    }
}

export function useMappedField(type) {
    const mapper = useMapper();
    return mapper[type];
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const { localizer } = useRenderingContext();
    return localizer;
}

export function useLocalizedString(string) {
    const { localizer } = useRenderingContext();
    return useMemo(
        () => localizer.getLocalizedString(string),
        [localizer, string]
    );
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
    const { decorator } = useRenderingContext();
    return decorator;
}
