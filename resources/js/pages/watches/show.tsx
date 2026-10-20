import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    ChevronLeftIcon,
    WatchIcon,
    WhatsappIcon,
} from '@/components/icons';
import { Price } from '@/components/price';
import { Badge } from '@/components/ui/badge';
import { WatchCard } from '@/components/watch-card';
import { useTranslation } from '@/lib/i18n';
import type { WatchCard as WatchCardType, WatchDetail } from '@/types/models';
import { cn } from '@/lib/utils';

type Props = {
    watch: WatchDetail;
    related: WatchCardType[];
};

export default function WatchShow({ watch, related }: Props) {
    const { t } = useTranslation();
    const [activeImage, setActiveImage] = useState(0);
    const images =
        watch.images.length > 0
            ? watch.images
            : watch.image
              ? [watch.image]
              : [];
    const image = images[activeImage];
    const isSold = watch.status.value === 'sold';
    const isReserved = watch.status.value === 'reserved';

    const specs = [
        [t('ui.watchPage.reference'), watch.reference_number],
        [t('ui.watchPage.year'), watch.year?.toString()],
        [t('ui.watchPage.movement'), watch.movement],
        [t('ui.watchPage.caseMaterial'), watch.case_material],
        [
            t('ui.watchPage.caseDiameter'),
            watch.case_diameter_mm
                ? `${watch.case_diameter_mm.toLocaleString('id-ID')} mm`
                : null,
        ],
        [t('ui.watchPage.dialColor'), watch.dial_color],
        [t('ui.watchPage.strapMaterial'), watch.strap_material],
        [t('ui.watchPage.condition'), watch.condition.label],
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));

    return (
        <>
            <Head title={`${watch.brand} ${watch.model}`}>
                <meta
                    name="description"
                    content={`${watch.brand} ${watch.model} ${watch.reference_number}`}
                />
            </Head>

            <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:py-12">
                <nav className="mb-8 flex items-center gap-2 text-xs text-foreground-muted">
                    <Link href="/watches" className="hover:text-brand">
                        {t('ui.nav.collection')}
                    </Link>
                    <span>/</span>
                    <span className="truncate text-foreground">
                        {watch.brand}
                    </span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div>
                        <div className="relative overflow-hidden rounded-panel border border-border bg-surface-muted">
                            {image ? (
                                <img
                                    src={image.url}
                                    alt={
                                        image.alt ||
                                        `${watch.brand} ${watch.model}`
                                    }
                                    className="aspect-[4/5] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[4/5] items-center justify-center text-foreground-subtle">
                                    <WatchIcon className="size-16" />
                                </div>
                            )}
                            {isSold || isReserved ? (
                                <div className="absolute top-4 left-4">
                                    <Badge
                                        variant={isSold ? 'neutral' : 'warning'}
                                    >
                                        {watch.status.label}
                                    </Badge>
                                </div>
                            ) : null}
                        </div>

                        {images.length > 1 ? (
                            <div className="mt-3 grid grid-cols-5 gap-3">
                                {images.map((item, index) => (
                                    <button
                                        key={`${item.path}-${index}`}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={cn(
                                            'overflow-hidden rounded-control border bg-surface-muted transition-colors',
                                            activeImage === index
                                                ? 'border-brand'
                                                : 'border-border hover:border-brand/50',
                                        )}
                                        aria-label={`Gambar ${index + 1}`}
                                        aria-pressed={activeImage === index}
                                    >
                                        <img
                                            src={item.url}
                                            alt=""
                                            className="aspect-square size-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                                {watch.condition.label}
                            </Badge>
                            <Badge
                                variant={
                                    watch.status.value === 'available'
                                        ? 'success'
                                        : watch.status.value === 'reserved'
                                          ? 'warning'
                                          : 'neutral'
                                }
                            >
                                {watch.status.label}
                            </Badge>
                            {watch.pricing.promotion?.label ? (
                                <Badge variant="accent">
                                    {watch.pricing.promotion.label}
                                </Badge>
                            ) : null}
                        </div>

                        <p className="mt-6 text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {watch.brand}
                        </p>
                        <h1 className="mt-2 font-display text-5xl leading-tight text-foreground">
                            {watch.model}
                        </h1>
                        <p className="mt-3 text-sm text-foreground-muted">
                            {watch.reference_number}
                            {watch.year ? ` · ${watch.year}` : ''}
                        </p>

                        <div className="mt-6 border-y border-border py-5">
                            <Price
                                price={watch.price}
                                finalPrice={watch.pricing.final_price}
                                discountAmount={watch.pricing.discount_amount}
                                size="lg"
                            />
                        </div>

                        {watch.description ? (
                            <div className="mt-6">
                                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-foreground-subtle uppercase">
                                    {t('ui.watchPage.story')}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-foreground-muted">
                                    {watch.description}
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-8">
                            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-foreground-subtle uppercase">
                                {t('ui.watchPage.specifications')}
                            </h2>
                            <dl className="mt-3 divide-y divide-border border-y border-border">
                                {specs.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-3 text-sm"
                                    >
                                        <dt className="text-foreground-muted">
                                            {label}
                                        </dt>
                                        <dd className="text-right font-medium text-foreground">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="mt-8">
                            {isSold || isReserved ? (
                                <div className="rounded-card border border-border bg-surface-muted p-4">
                                    <p className="font-semibold text-foreground">
                                        {isSold
                                            ? t('ui.watchPage.soldTitle')
                                            : t('ui.watchPage.reservedTitle')}
                                    </p>
                                    <p className="mt-1 text-sm text-foreground-muted">
                                        {isSold
                                            ? t('ui.watchPage.soldText')
                                            : t('ui.watchPage.reservedText')}
                                    </p>
                                </div>
                            ) : watch.whatsapp_url ? (
                                <a
                                    href={watch.whatsapp_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                                >
                                    <WhatsappIcon className="size-4" />
                                    {t('ui.watchPage.askAbout')}
                                </a>
                            ) : null}
                        </div>

                        <Link
                            href="/watches"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-brand"
                        >
                            <ChevronLeftIcon className="size-4" />
                            {t('ui.common.backToCollection')}
                        </Link>
                    </div>
                </div>

                {related.length > 0 ? (
                    <section className="mt-20 border-t border-border pt-12">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="font-display text-3xl text-foreground">
                                    {t('ui.watchPage.related')}
                                </h2>
                                <p className="mt-2 text-sm text-foreground-muted">
                                    {t('ui.watchPage.relatedSubtitle')}
                                </p>
                            </div>
                            <Link
                                href="/watches"
                                className="hidden items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline sm:inline-flex"
                            >
                                {t('ui.common.viewCollection')}
                                <ArrowRightIcon className="size-4" />
                            </Link>
                        </div>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <WatchCard key={item.uuid} watch={item} />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </>
    );
}
