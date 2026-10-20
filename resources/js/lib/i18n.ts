import { usePage } from '@inertiajs/react';

export type TranslationMap = Record<string, string>;

type Replacements = Record<string, string | number>;

function interpolate(value: string, replacements: Replacements): string {
    return Object.entries(replacements).reduce(
        (result, [key, replacement]) =>
            result.replaceAll(`{${key}}`, String(replacement)),
        value,
    );
}

export function translate(
    translations: TranslationMap | undefined,
    key: string,
    replacements: Replacements = {},
): string {
    const value = translations?.[key] ?? key;

    return interpolate(value, replacements);
}

export function useTranslation() {
    const page = usePage();
    const translations = page.props.translations as TranslationMap | undefined;

    return {
        t: (key: string, replacements: Replacements = {}) =>
            translate(translations, key, replacements),
        translations,
    };
}
