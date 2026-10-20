const timeZone = 'Asia/Jakarta';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID');

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
});

const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone,
});

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

export function formatNumber(value: number): string {
    return numberFormatter.format(value);
}

export function formatDate(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return dateFormatter.format(new Date(value));
}

export function formatDateTime(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return dateTimeFormatter.format(new Date(value));
}

export function formatShortDate(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return shortDateFormatter.format(new Date(value));
}

export function formatRelative(value?: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat('id-ID', {
        numeric: 'auto',
    });

    const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ['year', 60 * 60 * 24 * 365],
        ['month', 60 * 60 * 24 * 30],
        ['week', 60 * 60 * 24 * 7],
        ['day', 60 * 60 * 24],
        ['hour', 60 * 60],
        ['minute', 60],
        ['second', 1],
    ];

    for (const [unit, seconds] of ranges) {
        if (Math.abs(diffSeconds) >= seconds || unit === 'second') {
            return formatter.format(Math.round(diffSeconds / seconds), unit);
        }
    }

    return formatter.format(diffSeconds, 'second');
}
