import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CheckIcon,
    ChevronDownIcon,
    SearchIcon,
    XIcon,
} from '@/components/icons';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type MultiSelectOption = {
    value: string;
    label: string;
    keywords?: string;
};

type MultiSelectProps = {
    id?: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    className?: string;
};

export function MultiSelect({
    id,
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
    invalid = false,
    className,
}: MultiSelectProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOptions = useMemo(
        () =>
            value
                .map((selected) =>
                    options.find((option) => option.value === selected),
                )
                .filter(
                    (option): option is MultiSelectOption =>
                        option !== undefined,
                ),
        [options, value],
    );

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

    const toggle = (optionValue: string) => {
        onChange(
            value.includes(optionValue)
                ? value.filter((current) => current !== optionValue)
                : [...value, optionValue],
        );
    };

    const selectAll = () => {
        onChange(options.map((option) => option.value));
    };

    const clear = () => {
        onChange([]);
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div
                className={cn(
                    'relative flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-control border border-border bg-surface p-1.5 pr-10',
                    invalid && 'border-danger',
                )}
            >
                {selectedOptions.map((option) => (
                    <span
                        key={option.value}
                        className="inline-flex max-w-full items-center gap-1 rounded-pill bg-brand-soft py-0.5 pr-1 pl-2 text-xs font-medium text-brand"
                    >
                        <span className="truncate">{option.label}</span>
                        <button
                            type="button"
                            onClick={() =>
                                onChange(
                                    value.filter(
                                        (current) => current !== option.value,
                                    ),
                                )
                            }
                            aria-label={`${t('ui.components.multiSelect.clear')}: ${option.label}`}
                            className="inline-flex size-4 shrink-0 items-center justify-center rounded-pill hover:bg-brand/10"
                        >
                            <XIcon className="size-3" />
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    id={id}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-invalid={invalid || undefined}
                    disabled={disabled}
                    onClick={() => setOpen((current) => !current)}
                    className="inline-flex h-7 min-w-0 flex-1 items-center gap-1.5 px-1 text-left text-sm text-foreground-subtle focus:outline-none disabled:cursor-not-allowed"
                >
                    <span className="truncate">
                        {selectedOptions.length === 0
                            ? (placeholder ??
                              t('ui.components.multiSelect.placeholder'))
                            : t('ui.components.multiSelect.selected', {
                                  count: selectedOptions.length,
                              })}
                    </span>
                </button>

                <ChevronDownIcon
                    className={cn(
                        'pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground-muted transition-transform',
                        open && 'rotate-180',
                    )}
                />
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
                                    'ui.components.multiSelect.searchPlaceholder',
                                )}
                                className="h-9 w-full rounded-control border border-border bg-surface-muted pr-3 pl-8 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none"
                            />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 px-1">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="text-xs font-semibold text-brand hover:underline"
                            >
                                {t('ui.components.multiSelect.selectAll')}
                            </button>
                            <button
                                type="button"
                                onClick={clear}
                                className="text-xs font-semibold text-foreground-subtle hover:text-danger"
                            >
                                {t('ui.components.multiSelect.clear')}
                            </button>
                        </div>
                    </div>

                    <ul
                        role="listbox"
                        aria-multiselectable="true"
                        className="max-h-60 overflow-y-auto p-1"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const active = value.includes(option.value);

                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            onClick={() => toggle(option.value)}
                                            className={cn(
                                                'flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-sm transition-colors',
                                                active
                                                    ? 'bg-brand-soft text-brand'
                                                    : 'text-foreground hover:bg-surface-muted',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex size-4 shrink-0 items-center justify-center rounded-[4px] border',
                                                    active
                                                        ? 'border-brand bg-brand text-brand-foreground'
                                                        : 'border-border bg-surface',
                                                )}
                                            >
                                                {active ? (
                                                    <CheckIcon className="size-3" />
                                                ) : null}
                                            </span>
                                            <span className="truncate">
                                                {option.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-4 text-center text-xs text-foreground-subtle">
                                {t('ui.components.multiSelect.empty')}
                            </li>
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
