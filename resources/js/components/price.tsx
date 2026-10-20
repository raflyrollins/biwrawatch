import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

type PriceProps = {
    price: number;
    finalPrice?: number;
    discountAmount?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const sizes = {
    sm: {
        final: 'text-lg',
        original: 'text-xs',
        discount: 'text-[10px]',
    },
    md: {
        final: 'text-xl',
        original: 'text-sm',
        discount: 'text-[11px]',
    },
    lg: {
        final: 'text-3xl',
        original: 'text-base',
        discount: 'text-xs',
    },
};

export function Price({
    price,
    finalPrice,
    discountAmount = 0,
    className,
    size = 'md',
}: PriceProps) {
    const effectivePrice = finalPrice ?? price;
    const hasDiscount = effectivePrice < price;
    const styles = sizes[size];

    return (
        <div
            className={cn(
                'flex flex-wrap items-baseline gap-x-2 gap-y-1',
                className,
            )}
        >
            <span
                className={cn(
                    'font-semibold tracking-tight text-accent tabular-nums',
                    styles.final,
                )}
            >
                {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount ? (
                <>
                    <span
                        className={cn(
                            'text-foreground-subtle tabular-nums line-through',
                            styles.original,
                        )}
                    >
                        {formatCurrency(price)}
                    </span>
                    {discountAmount > 0 ? (
                        <span
                            className={cn(
                                'rounded-pill bg-brand-soft px-2 py-0.5 font-semibold text-brand',
                                styles.discount,
                            )}
                        >
                            Hemat {formatCurrency(discountAmount)}
                        </span>
                    ) : null}
                </>
            ) : null}
        </div>
    );
}
