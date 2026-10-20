import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRightIcon,
    PackageIcon,
    ShieldCheckIcon,
    SparklesIcon,
    WhatsappIcon,
} from '@/components/icons';
import { WatchCard } from '@/components/watch-card';
import { useTranslation } from '@/lib/i18n';
import type { WatchCard as WatchCardType } from '@/types/models';

type Site = {
    name: string;
    whatsapp_url: string | null;
};

export default function Home({ featured }: { featured: WatchCardType[] }) {
    const { t } = useTranslation();
    const page = usePage();
    const site = page.props.site as Site | undefined;
    const hero = featured[0];

    return (
        <>
            <Head title={t('ui.nav.collection')} />

            <section className="relative overflow-hidden border-b border-border">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,var(--color-brand-soft),transparent_42%)]" />
                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
                    <div className="max-w-xl">
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {t('ui.home.eyebrow')}
                        </p>
                        <h1 className="mt-5 font-display text-5xl leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
                            {t('ui.home.title')}
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground-muted">
                            {t('ui.home.subtitle')}
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                href="/watches"
                                className="inline-flex h-12 items-center gap-2 rounded-control bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                            >
                                {t('ui.home.primaryCta')}
                                <ArrowRightIcon className="size-4" />
                            </Link>
                            <Link
                                href="/track"
                                className="inline-flex h-12 items-center gap-2 rounded-control border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                            >
                                <PackageIcon className="size-4" />
                                {t('ui.home.secondaryCta')}
                            </Link>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="absolute -inset-4 rounded-panel border border-border/70" />
                        <div className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
                            {hero?.image ? (
                                <Link href={hero.url} className="block">
                                    <img
                                        src={hero.image.url}
                                        alt={
                                            hero.image.alt ||
                                            `${hero.brand} ${hero.model}`
                                        }
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                </Link>
                            ) : (
                                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4 bg-surface-muted p-10 text-center">
                                    <SparklesIcon className="size-10 text-brand" />
                                    <p className="font-display text-3xl text-foreground">
                                        {hero
                                            ? `${hero.brand} ${hero.model}`
                                            : t('ui.home.featuredTitle')}
                                    </p>
                                </div>
                            )}
                            {hero ? (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-20">
                                    <p className="text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                                        {hero.brand}
                                    </p>
                                    <div className="mt-1 flex items-end justify-between gap-4">
                                        <p className="font-display text-2xl text-white">
                                            {hero.model}
                                        </p>
                                        <Link
                                            href={hero.url}
                                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-pill bg-white text-black"
                                            aria-label={t(
                                                'ui.common.viewDetails',
                                            )}
                                        >
                                            <ArrowRightIcon className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {t('ui.home.featuredEyebrow')}
                        </p>
                        <h2 className="mt-3 font-display text-4xl text-foreground">
                            {t('ui.home.featuredTitle')}
                        </h2>
                        <p className="mt-3 max-w-xl text-sm text-foreground-muted">
                            {t('ui.home.featuredSubtitle')}
                        </p>
                    </div>
                    <Link
                        href="/watches"
                        className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                    >
                        {t('ui.home.viewAll')}
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </div>

                {featured.length > 0 ? (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((watch) => (
                            <WatchCard key={watch.uuid} watch={watch} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-panel border border-dashed border-border bg-surface-muted/50 px-6 py-16 text-center">
                        <img
                            src="/images/illustrations/no-data.svg"
                            alt=""
                            className="mx-auto mb-6 h-36 w-auto"
                            loading="lazy"
                        />
                        <p className="font-display text-2xl text-foreground">
                            {t('ui.catalog.emptyTitle')}
                        </p>
                        <p className="mt-2 text-sm text-foreground-muted">
                            {t('ui.catalog.emptyText')}
                        </p>
                    </div>
                )}
            </section>

            <section className="border-y border-border bg-surface">
                <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
                    <div className="max-w-xl">
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                            {t('ui.home.valuesEyebrow')}
                        </p>
                        <h2 className="mt-3 font-display text-4xl text-foreground">
                            {t('ui.home.valuesTitle')}
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: SparklesIcon,
                                title: t('ui.home.value1Title'),
                                text: t('ui.home.value1Text'),
                            },
                            {
                                icon: ShieldCheckIcon,
                                title: t('ui.home.value2Title'),
                                text: t('ui.home.value2Text'),
                            },
                            {
                                icon: WhatsappIcon,
                                title: t('ui.home.value3Title'),
                                text: t('ui.home.value3Text'),
                            },
                        ].map(({ icon: Icon, title, text }) => (
                            <div
                                key={title}
                                className="border-t border-border pt-5"
                            >
                                <Icon className="size-5 text-brand" />
                                <h3 className="mt-4 font-display text-2xl text-foreground">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-16 sm:py-24 lg:grid-cols-2">
                <div className="rounded-panel border border-border bg-surface p-8 sm:p-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-sm">
                            <PackageIcon className="size-6 text-brand" />
                            <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                                {t('ui.home.trackEyebrow')}
                            </p>
                            <h2 className="mt-3 font-display text-3xl text-foreground">
                                {t('ui.home.trackTitle')}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                                {t('ui.home.trackText')}
                            </p>
                            <Link
                                href="/track"
                                className="mt-6 inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                            >
                                {t('ui.home.trackCta')}
                                <ArrowRightIcon className="size-4" />
                            </Link>
                        </div>
                        <img
                            src="/images/illustrations/delivery.svg"
                            alt=""
                            className="mx-auto h-40 w-auto shrink-0 sm:mx-0 sm:h-48"
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="rounded-panel border border-brand/20 bg-brand-soft p-8 sm:p-10">
                    <WhatsappIcon className="size-6 text-brand" />
                    <h2 className="mt-6 font-display text-3xl text-foreground">
                        {t('ui.home.whatsappTitle')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                        {t('ui.home.whatsappText')}
                    </p>
                    {site?.whatsapp_url ? (
                        <a
                            href={site.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex h-10 items-center gap-2 rounded-control bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                        >
                            <WhatsappIcon className="size-4" />
                            {t('ui.common.contactWhatsapp')}
                        </a>
                    ) : null}
                </div>
            </section>
        </>
    );
}
