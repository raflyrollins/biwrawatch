import { Link } from '@inertiajs/react';
import { Price } from '@/components/price';
import { WatchIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import type { WatchCard as WatchCardType } from '@/types/models';
import { cn } from '@/lib/utils';

export function WatchCard({
    watch,
    className,
}: {
    watch: WatchCardType;
    className?: string;
}) {
    const { t } = useTranslation();
    const isSold = watch.status.value === 'sold';
    const isReserved = watch.status.value === 'reserved';
    const promoLabel = watch.pricing.promotion?.label;

    return (
        <Card
            as="article"
            className={cn(
                'group flex h-full flex-col overflow-hidden transition-colors hover:border-brand/40',
                className,
            )}
        >
            <Link
                href={watch.url}
                className="relative block aspect-[4/5] overflow-hidden bg-surface-muted"
                aria-label={`${watch.brand} ${watch.model}`}
            >
                {watch.image ? (
                    <img
                        src={watch.image.url}
                        alt={watch.image.alt || `${watch.brand} ${watch.model}`}
                        loading="lazy"
                        className={cn(
                            'size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]',
                            isSold && 'opacity-60 grayscale',
                        )}
                    />
                ) : (
                    <span className="flex size-full items-center justify-center text-foreground-subtle">
                        <WatchIcon className="size-12" />
                    </span>
                )}

                <div className="absolute top-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
                    {promoLabel ? (
                        <Badge variant="accent">{promoLabel}</Badge>
                    ) : null}
                    {isSold || isReserved ? (
                        <Badge variant={isSold ? 'neutral' : 'warning'}>
                            {watch.status.label}
                        </Badge>
                    ) : null}
                </div>
            </Link>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-foreground-subtle uppercase">
                            {watch.brand}
                        </p>
                        <h3 className="mt-1 font-display text-xl leading-tight text-foreground">
                            <Link
                                href={watch.url}
                                className="underline-offset-4 hover:underline"
                            >
                                {watch.model}
                            </Link>
                        </h3>
                    </div>
                    <Badge variant="outline">{watch.condition.label}</Badge>
                </div>

                <p className="text-xs text-foreground-muted">
                    {watch.reference_number}
                    {watch.year ? ` · ${watch.year}` : ''}
                </p>

                <div className="mt-auto pt-2">
                    <Price
                        price={watch.price}
                        finalPrice={watch.pricing.final_price}
                        discountAmount={watch.pricing.discount_amount}
                        size="sm"
                    />
                </div>

                <Link
                    href={watch.url}
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-control border border-border text-xs font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                    {t('ui.common.viewDetails')}
                </Link>
            </div>
        </Card>
    );
}
