import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XIcon,
} from '@/components/icons';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type CalendarMode = 'date' | 'datetime';

type ParsedValue = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
};

type CalendarWidgetProps = {
    id?: string;
    name?: string;
    value: string;
    onChange: (value: string) => void;
    mode?: CalendarMode;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    clearable?: boolean;
    className?: string;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const monthFormatter = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
});

const ariaDateFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayFormatter.format(new Date(2024, 0, 1 + index)),
);

function parseValue(value: string): ParsedValue | null {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);

    if (!match) {
        return null;
    }

    const [, year, month, day, hour = '9', minute = '0'] = match;

    return {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
    };
}

function pad(value: number): string {
    return value.toString().padStart(2, '0');
}

function dateString(year: number, month: number, day: number): string {
    return `${year}-${pad(month)}-${pad(day)}`;
}

function dateTimeString(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
): string {
    return `${dateString(year, month, day)}T${pad(hour)}:${pad(minute)}`;
}

export function CalendarWidget({
    id,
    name,
    value,
    onChange,
    mode = 'date',
    placeholder,
    disabled = false,
    invalid = false,
    clearable = true,
    className,
}: CalendarWidgetProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        const parsed = parseValue(value);

        return parsed ? new Date(parsed.year, parsed.month - 1, 1) : new Date();
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const parsed = parseValue(value);

    const displayValue = useMemo(() => {
        if (!parsed) {
            return '';
        }

        const date = new Date(parsed.year, parsed.month - 1, parsed.day);

        if (mode === 'datetime') {
            return dateTimeFormatter.format(date);
        }

        return dateFormatter.format(date);
    }, [mode, parsed]);

    const days = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: Array<number | null> = Array.from(
            { length: firstWeekday },
            () => null,
        );

        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push(day);
        }

        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        return cells;
    }, [viewDate]);

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

        const escape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', dismiss);
        document.addEventListener('keydown', escape);

        return () => {
            document.removeEventListener('mousedown', dismiss);
            document.removeEventListener('keydown', escape);
        };
    }, [open]);

    const openCalendar = () => {
        if (disabled) {
            return;
        }

        const current = parseValue(value);
        setViewDate(
            current ? new Date(current.year, current.month - 1, 1) : new Date(),
        );
        setOpen(true);
    };

    const selectDay = (day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;

        if (mode === 'date') {
            onChange(dateString(year, month, day));
            setOpen(false);

            return;
        }

        onChange(
            dateTimeString(
                year,
                month,
                day,
                parsed?.hour ?? 9,
                parsed?.minute ?? 0,
            ),
        );
    };

    const selectTime = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const target = parsed
            ? {
                  year: parsed.year,
                  month: parsed.month,
                  day: parsed.day,
              }
            : {
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1,
                  day: new Date().getDate(),
              };

        onChange(
            dateTimeString(target.year, target.month, target.day, hour, minute),
        );
    };

    const selectToday = () => {
        const today = new Date();

        if (mode === 'date') {
            onChange(
                dateString(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    today.getDate(),
                ),
            );
            setOpen(false);

            return;
        }

        onChange(
            dateTimeString(
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate(),
                parsed?.hour ?? 9,
                parsed?.minute ?? 0,
            ),
        );
    };

    const clear = () => {
        onChange('');
        setOpen(false);
    };

    const today = new Date();
    const todayValue = dateString(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
    );

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {name ? <input type="hidden" name={name} value={value} /> : null}

            <div className="relative">
                <button
                    type="button"
                    id={id}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-invalid={invalid || undefined}
                    disabled={disabled}
                    onClick={() => (open ? setOpen(false) : openCalendar())}
                    className={cn(
                        'flex h-11 w-full items-center gap-2 rounded-control border border-border bg-surface px-3.5 text-left text-sm transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted',
                        clearable && value !== '' && 'pr-12',
                        invalid &&
                            'border-danger focus:border-danger focus:ring-danger/15',
                    )}
                >
                    <CalendarIcon className="size-4 shrink-0 text-foreground-muted" />
                    <span
                        className={cn(
                            'truncate',
                            displayValue
                                ? 'text-foreground'
                                : 'text-foreground-subtle',
                        )}
                    >
                        {displayValue ||
                            placeholder ||
                            t(
                                mode === 'datetime'
                                    ? 'ui.components.calendar.dateTimePlaceholder'
                                    : 'ui.components.calendar.placeholder',
                            )}
                    </span>
                </button>

                {clearable && value !== '' ? (
                    <button
                        type="button"
                        onClick={clear}
                        aria-label={t('ui.components.calendar.clear')}
                        className="absolute top-1/2 right-3 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-pill text-foreground-subtle hover:bg-surface-muted hover:text-foreground"
                    >
                        <XIcon className="size-3.5" />
                    </button>
                ) : null}
            </div>

            {open ? (
                <div
                    role="dialog"
                    aria-label={t('ui.components.calendar.placeholder')}
                    className="absolute z-50 mt-1 w-80 max-w-[calc(100vw-3rem)] rounded-card border border-border bg-surface p-3 shadow-lg"
                >
                    <div className="flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setViewDate(
                                    new Date(
                                        viewDate.getFullYear(),
                                        viewDate.getMonth() - 1,
                                        1,
                                    ),
                                )
                            }
                            aria-label={t(
                                'ui.components.calendar.previousMonth',
                            )}
                            className="inline-flex size-8 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                        >
                            <ChevronLeftIcon className="size-4" />
                        </button>
                        <p className="text-sm font-semibold text-foreground">
                            {monthFormatter.format(viewDate)}
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                setViewDate(
                                    new Date(
                                        viewDate.getFullYear(),
                                        viewDate.getMonth() + 1,
                                        1,
                                    ),
                                )
                            }
                            aria-label={t('ui.components.calendar.nextMonth')}
                            className="inline-flex size-8 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                        >
                            <ChevronRightIcon className="size-4" />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-0.5">
                        {weekdays.map((weekday) => (
                            <span
                                key={weekday}
                                className="py-1 text-center text-[10px] font-semibold tracking-wide text-foreground-subtle uppercase"
                            >
                                {weekday}
                            </span>
                        ))}
                        {days.map((day, index) => {
                            if (day === null) {
                                return <span key={`empty-${index}`} />;
                            }

                            const year = viewDate.getFullYear();
                            const month = viewDate.getMonth() + 1;
                            const cellValue = dateString(year, month, day);
                            const selected =
                                parsed !== null &&
                                parsed.year === year &&
                                parsed.month === month &&
                                parsed.day === day;
                            const isToday = cellValue === todayValue;
                            const cellDate = new Date(year, month - 1, day);

                            return (
                                <button
                                    key={cellValue}
                                    type="button"
                                    onClick={() => selectDay(day)}
                                    aria-label={ariaDateFormatter.format(
                                        cellDate,
                                    )}
                                    aria-pressed={selected}
                                    className={cn(
                                        'inline-flex size-9 items-center justify-center rounded-control text-sm transition-colors',
                                        selected
                                            ? 'bg-brand font-semibold text-brand-foreground'
                                            : 'text-foreground hover:bg-surface-muted',
                                        !selected &&
                                            isToday &&
                                            'border border-brand/40 text-brand',
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {mode === 'datetime' ? (
                        <label className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                            <span className="text-xs font-semibold text-foreground-subtle">
                                {t('ui.components.calendar.time')}
                            </span>
                            <input
                                type="time"
                                value={
                                    parsed
                                        ? `${pad(parsed.hour)}:${pad(parsed.minute)}`
                                        : '09:00'
                                }
                                onChange={(event) =>
                                    selectTime(event.target.value)
                                }
                                className="h-9 rounded-control border border-border bg-surface px-2 text-sm text-foreground focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none"
                            />
                        </label>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                        <button
                            type="button"
                            onClick={selectToday}
                            className="text-xs font-semibold text-brand hover:underline"
                        >
                            {t('ui.components.calendar.today')}
                        </button>
                        <div className="flex items-center gap-2">
                            {value !== '' ? (
                                <button
                                    type="button"
                                    onClick={clear}
                                    className="text-xs font-semibold text-foreground-subtle hover:text-danger"
                                >
                                    {t('ui.components.calendar.clear')}
                                </button>
                            ) : null}
                            {mode === 'datetime' ? (
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="h-8 rounded-control bg-brand px-3 text-xs font-semibold text-brand-foreground hover:bg-brand-hover"
                                >
                                    {t('ui.components.calendar.done')}
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
