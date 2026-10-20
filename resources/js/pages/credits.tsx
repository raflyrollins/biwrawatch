import { Head, Link } from '@inertiajs/react';
import { ArrowUpRightIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

export default function Credits() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('ui.credits.title')} />

            <section className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20">
                <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                    {t('ui.credits.eyebrow')}
                </p>
                <h1 className="mt-4 font-display text-5xl text-foreground">
                    {t('ui.credits.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
                    {t('ui.credits.subtitle')}
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="font-display text-2xl text-foreground">
                            {t('ui.credits.photosTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {t('ui.credits.photosText')}
                        </p>
                        <a
                            href="https://unsplash.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                        >
                            {t('ui.credits.unsplash')}
                            <ArrowUpRightIcon className="size-3.5" />
                        </a>
                    </Card>

                    <Card className="p-6">
                        <h2 className="font-display text-2xl text-foreground">
                            {t('ui.credits.illustrationsTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                            {t('ui.credits.illustrationsText')}
                        </p>
                        <a
                            href="https://storyset.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                        >
                            {t('ui.credits.storyset')}
                            <ArrowUpRightIcon className="size-3.5" />
                        </a>
                    </Card>
                </div>

                <Card className="mt-5 p-6">
                    <h2 className="font-display text-2xl text-foreground">
                        {t('ui.credits.rightsTitle')}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                        {t('ui.credits.rightsText')}
                    </p>
                </Card>

                <Link
                    href="/"
                    className="mt-8 inline-flex text-sm font-semibold text-foreground-muted hover:text-brand"
                >
                    {t('ui.common.backHome')}
                </Link>
            </section>
        </>
    );
}
