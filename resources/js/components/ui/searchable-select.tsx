import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CheckIcon,
    ChevronDownIcon,
    SearchIcon,
    XIcon,
} from '@/components/icons';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type SearchableSelectOption = {
    value: string;
    label: string;
    keywords?: string;
};

type SearchableSelectProps = {
    id?: string;
    name?: string;
    options: SearchableSelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    clearable?: boolean;
    className?: string;
};

export function SearchableSelect({
    id,
    name,
    options,
    value,
    defaultValue = '',
    onChange,
    placeholder,
    disabled = false,
    invalid = false,
    clearable = false,
    className,
}: SearchableSelectProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [internalValue, setInternalValue] = useState(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const currentValue = value ?? internalValue;
    const selected = options.find((option) => option.value === currentValue);

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (query === '') {
            return options;
        }

        return options.filter((option) =>
            `${option.label} ${option.keywords ?? ''}`
                .toLowerCase()
                .includes(query),
        );
    }, [options, search]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const dismiss = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', dismiss);

        return () => document.removeEventListener('mousedown', dismiss);
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setSearch('');
        window.requestAnimationFrame(() => searchRef.current?.focus());
    }, [open]);

    const select = (nextValue: string) => {
        if (value === undefined) {
            setInternalValue(nextValue);
        }

        onChange?.(nextValue);
        setOpen(false);
    };

    const clear = () => {
        if (value === undefined) {
            setInternalValue('');
        }

        onChange?.('');
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {name ? (
                <input type="hidden" name={name} value={currentValue} />
            ) : null}

            <div className="relative">
                <button
                    type="button"
                    id={id}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-invalid={invalid || undefined}
                    disabled={disabled}
                    onClick={() => setOpen((current) => !current)}
                    className={cn(
                        'flex h-11 w-full items-center justify-between gap-2 rounded-control border border-border bg-surface px-3.5 text-left text-sm text-foreground transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted',
                        clearable && currentValue !== '' && 'pr-14',
                        invalid &&
                            'border-danger focus:border-danger focus:ring-danger/15',
                    )}
                >
                    <span
                        className={cn(
                            'truncate',
                            selected
                                ? 'text-foreground'
                                : 'text-foreground-subtle',
                        )}
                    >
                        {selected?.label ??
                            placeholder ??
                            t(
                                'ui.components.searchableSelect.searchPlaceholder',
                            )}
                    </span>
                    <ChevronDownIcon
                        className={cn(
                            'size-4 shrink-0 text-foreground-muted transition-transform',
                            open && 'rotate-180',
                        )}
                    />
                </button>

                {clearable && currentValue !== '' ? (
                    <button
                        type="button"
                        onClick={clear}
                        aria-label={t('ui.components.searchableSelect.clear')}
                        className="absolute top-1/2 right-9 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-pill text-foreground-subtle hover:bg-surface-muted hover:text-foreground"
                    >
                        <XIcon className="size-3.5" />
                    </button>
                ) : null}
            </div>

            {open ? (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-card border border-border bg-surface shadow-lg">
                    <div className="border-b border-border p-2">
                        <div className="relative">
                            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-foreground-subtle" />
                            <input
                                ref={searchRef}
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder={t(
                                    'ui.components.searchableSelect.searchPlaceholder',
                                )}
                                className="h-9 w-full rounded-control border border-border bg-surface-muted pr-3 pl-8 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none"
                            />
                        </div>
                    </div>

                    <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const active = option.value === currentValue;

                                return (
                                    <li key={option.value || '__empty'}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            onClick={() => select(option.value)}
                                            className={cn(
                                                'flex w-full items-center justify-between gap-3 rounded-[4px] px-2.5 py-2 text-left text-sm transition-colors',
                                                active
                                                    ? 'bg-brand-soft text-brand'
                                                    : 'text-foreground hover:bg-surface-muted',
                                            )}
                                        >
                                            <span className="truncate">
                                                {option.label}
                                            </span>
                                            {active ? (
                                                <CheckIcon className="size-4 shrink-0" />
                                            ) : null}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-4 text-center text-xs text-foreground-subtle">
                                {t('ui.components.searchableSelect.empty')}
                            </li>
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
