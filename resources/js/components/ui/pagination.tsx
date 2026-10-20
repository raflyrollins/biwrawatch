import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
    className?: string;
};

function labelFor(label: string): string {
    if (label.includes('Previous')) {
        return 'Sebelumnya';
    }

    if (label.includes('Next')) {
        return 'Berikutnya';
    }

    return label;
}

export function Pagination({
    links,
    from,
    to,
    total,
    className,
}: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Navigasi halaman"
            className={cn(
                'flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row',
                className,
            )}
        >
            <p className="text-xs text-foreground-muted">
                Menampilkan {from ?? 0}–{to ?? 0} dari {total ?? 0}
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, index) => {
                    const isPrevious = index === 0;
                    const isNext = index === links.length - 1;
                    const label = labelFor(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={`${link.label}-${index}`}
                                className={cn(
                                    'inline-flex h-9 min-w-9 items-center justify-center rounded-control px-2 text-xs text-foreground-subtle',
                                    isPrevious || isNext
                                        ? 'w-9'
                                        : 'hidden sm:inline-flex',
                                )}
                            >
                                {isPrevious ? (
                                    <ChevronLeftIcon className="size-4" />
                                ) : isNext ? (
                                    <ChevronRightIcon className="size-4" />
                                ) : (
                                    label
                                )}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url}
                            preserveScroll
                            className={cn(
                                'inline-flex h-9 min-w-9 items-center justify-center rounded-control px-2 text-xs font-semibold transition-colors',
                                link.active
                                    ? 'bg-brand text-brand-foreground'
                                    : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                                isPrevious || isNext
                                    ? 'w-9'
                                    : 'hidden sm:inline-flex',
                            )}
                            aria-current={link.active ? 'page' : undefined}
                        >
                            {isPrevious ? (
                                <ChevronLeftIcon className="size-4" />
                            ) : isNext ? (
                                <ChevronRightIcon className="size-4" />
                            ) : (
                                label
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
