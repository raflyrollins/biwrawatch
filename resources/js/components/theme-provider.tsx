import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
    mode: ThemeMode;
    resolvedTheme: ResolvedTheme;
    setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = 'biwrawatch-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
    return value === 'light' || value === 'dark' || value === 'system';
}

function readStoredMode(): ThemeMode {
    if (typeof window === 'undefined') {
        return 'system';
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        return isThemeMode(stored) ? stored : 'system';
    } catch {
        return 'system';
    }
}

function systemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
    return mode === 'system' ? systemTheme() : mode;
}

function applyTheme(theme: ResolvedTheme): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    const applyMode = useCallback((nextMode: ThemeMode) => {
        const theme = resolveTheme(nextMode);

        setModeState(nextMode);
        setResolvedTheme(theme);
        applyTheme(theme);
    }, []);

    const setMode = useCallback(
        (nextMode: ThemeMode) => {
            applyMode(nextMode);

            try {
                window.localStorage.setItem(STORAGE_KEY, nextMode);
            } catch {
                // Storage can be unavailable in private browsing contexts.
            }
        },
        [applyMode],
    );

    useEffect(() => {
        applyMode(readStoredMode());
    }, [applyMode]);

    useEffect(() => {
        if (mode !== 'system') {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const theme = systemTheme();
            setResolvedTheme(theme);
            applyTheme(theme);
        };

        media.addEventListener('change', handleChange);

        return () => media.removeEventListener('change', handleChange);
    }, [mode]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY || !isThemeMode(event.newValue)) {
                return;
            }

            applyMode(event.newValue);
        };

        window.addEventListener('storage', handleStorage);

        return () => window.removeEventListener('storage', handleStorage);
    }, [applyMode]);

    const value = useMemo(
        () => ({ mode, resolvedTheme, setMode }),
        [mode, resolvedTheme, setMode],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }

    return context;
}
