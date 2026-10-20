import { MonitorIcon, MoonIcon, SunIcon } from '@/components/icons';
import { useTheme, type ThemeMode } from '@/components/theme-provider';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const options: Array<{
    mode: ThemeMode;
    icon: typeof SunIcon;
    labelKey: string;
}> = [
    { mode: 'light', icon: SunIcon, labelKey: 'theme.light' },
    { mode: 'dark', icon: MoonIcon, labelKey: 'theme.dark' },
    { mode: 'system', icon: MonitorIcon, labelKey: 'theme.system' },
];

export function ThemeToggle({ className }: { className?: string }) {
    const { mode, setMode } = useTheme();
    const { t } = useTranslation();

    return (
        <div
            role="group"
            aria-label={t('theme.label')}
            className={cn(
                'inline-flex items-center gap-0.5 rounded-control border border-border bg-surface p-0.5',
                className,
            )}
        >
            {options.map(({ mode: optionMode, icon: Icon, labelKey }) => {
                const active = mode === optionMode;

                return (
                    <button
                        key={optionMode}
                        type="button"
                        onClick={() => setMode(optionMode)}
                        aria-pressed={active}
                        aria-label={t(labelKey)}
                        title={t(labelKey)}
                        className={cn(
                            'inline-flex size-8 items-center justify-center rounded-[4px] transition-colors',
                            active
                                ? 'bg-brand-soft text-brand'
                                : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                    </button>
                );
            })}
        </div>
    );
}
