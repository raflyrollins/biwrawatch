import { Form, Head, Link } from '@inertiajs/react';
import { FilterIcon, SearchIcon } from '@/components/icons';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WatchCard } from '@/components/watch-card';
import { useTranslation } from '@/lib/i18n';
import { formatNumber } from '@/lib/format';
import type { Paginator, WatchCard as WatchCardType } from '@/types/models';

type Filters = {
    q?: string | null;
    brand?: string | null;
    condition?: string | null;
    status?: string | null;
    year_min?: number | null;
    year_max?: number | null;
    price_min?: number | null;
    price_max?: number | null;
    sort?: string | null;
};

type Props = {
    watches: Paginator<WatchCardType>;
    filters: Filters;
    brands: string[];
    conditions: Record<string, string>;
    statuses: Record<string, string>;
};

export default function WatchesIndex({
    watches,
    filters,
    brands,
    conditions,
    statuses,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('ui.catalog.title')} />

            <section className="border-b border-border bg-surface">
                <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:py-18">
                    <p className="text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                        {t('ui.catalog.eyebrow')}
                    </p>
                    <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
                        {t('ui.catalog.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
                        {t('ui.catalog.subtitle')}
                    </p>
                </div>
            </section>

            <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-14">
                <Card className="p-4 sm:p-5">
                    <Form
                        action="/watches"
                        method="get"
                        options={{ preserveState: true }}
                    >
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Field
                                label={t('ui.catalog.searchLabel')}
                                htmlFor="q"
                                className="md:col-span-2"
                            >
                                <div className="relative">
                                    <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground-subtle" />
                                    <Input
                                        id="q"
                                        name="q"
                                        defaultValue={filters.q ?? ''}
                                        placeholder={t(
                                            'ui.catalog.searchPlaceholder',
                                        )}
                                        className="pl-10"
                                    />
                                </div>
                            </Field>

                            <Field
                                label={t('ui.catalog.brand')}
                                htmlFor="brand"
                            >
                                <SearchableSelect
                                    id="brand"
                                    name="brand"
                                    defaultValue={filters.brand ?? ''}
                                    options={[
                                        {
                                            value: '',
                                            label: t('ui.catalog.allBrands'),
                                        },
                                        ...brands.map((brand) => ({
                                            value: brand,
                                            label: brand,
                                        })),
                                    ]}
                                />
                            </Field>

                            <Field
                                label={t('ui.catalog.condition')}
                                htmlFor="condition"
                            >
                                <Select
                                    id="condition"
                                    name="condition"
                                    defaultValue={filters.condition ?? ''}
                                >
                                    <option value="">
                                        {t('ui.catalog.allConditions')}
                                    </option>
                                    {Object.entries(conditions).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </Select>
                            </Field>

                            <Field
                                label={t('ui.catalog.availability')}
                                htmlFor="status"
                            >
                                <Select
                                    id="status"
                                    name="status"
                                    defaultValue={filters.status ?? ''}
                                >
                                    <option value="">
                                        {t('ui.catalog.allAvailability')}
                                    </option>
                                    {Object.entries(statuses).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </Select>
                            </Field>

                            <Field
                                label={t('ui.catalog.yearMin')}
                                htmlFor="year_min"
                            >
                                <Input
                                    id="year_min"
                                    name="year_min"
                                    type="number"
                                    inputMode="numeric"
                                    min={1900}
                                    defaultValue={filters.year_min ?? ''}
                                />
                            </Field>

                            <Field
                                label={t('ui.catalog.yearMax')}
                                htmlFor="year_max"
                            >
                                <Input
                                    id="year_max"
                                    name="year_max"
                                    type="number"
                                    inputMode="numeric"
                                    min={1900}
                                    defaultValue={filters.year_max ?? ''}
                                />
                            </Field>

                            <Field
                                label={t('ui.catalog.priceMin')}
                                htmlFor="price_min"
                            >
                                <Input
                                    id="price_min"
                                    name="price_min"
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    step={100000}
                                    defaultValue={filters.price_min ?? ''}
                                />
                            </Field>

                            <Field
                                label={t('ui.catalog.priceMax')}
                                htmlFor="price_max"
                            >
                                <Input
                                    id="price_max"
                                    name="price_max"
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    step={100000}
                                    defaultValue={filters.price_max ?? ''}
                                />
                            </Field>

                            <Field label={t('ui.catalog.sort')} htmlFor="sort">
                                <Select
                                    id="sort"
                                    name="sort"
                                    defaultValue={filters.sort ?? 'featured'}
                                >
                                    <option value="relevance">
                                        {t('ui.catalog.sortOptions.relevance')}
                                    </option>
                                    <option value="featured">
                                        {t('ui.catalog.sortOptions.featured')}
                                    </option>
                                    <option value="newest">
                                        {t('ui.catalog.sortOptions.newest')}
                                    </option>
                                    <option value="price_asc">
                                        {t('ui.catalog.sortOptions.price_asc')}
                                    </option>
                                    <option value="price_desc">
                                        {t('ui.catalog.sortOptions.price_desc')}
                                    </option>
                                </Select>
                            </Field>

                            <div className="flex items-end gap-2 md:col-span-2">
                                <Button type="submit" className="flex-1">
                                    <FilterIcon className="size-4" />
                                    {t('ui.catalog.apply')}
                                </Button>
                                <Link
                                    href="/watches"
                                    className="inline-flex h-11 items-center justify-center rounded-control border border-border px-4 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground"
                                >
                                    {t('ui.catalog.reset')}
                                </Link>
                            </div>
                        </div>
                    </Form>
                </Card>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <p className="text-sm text-foreground-muted">
                        <span className="font-semibold text-foreground">
                            {formatNumber(watches.total)}
                        </span>{' '}
                        {t('ui.catalog.results')}
                    </p>
                </div>

                {watches.data.length > 0 ? (
                    <>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {watches.data.map((watch) => (
                                <WatchCard key={watch.uuid} watch={watch} />
                            ))}
                        </div>
                        <Pagination
                            links={watches.links}
                            from={watches.from}
                            to={watches.to}
                            total={watches.total}
                            className="mt-10"
                        />
                    </>
                ) : (
                    <EmptyState
                        className="mt-5"
                        illustration="/images/illustrations/no-data.svg"
                        title={t('ui.catalog.emptyTitle')}
                        description={t('ui.catalog.emptyText')}
                        action={
                            <Link
                                href="/watches"
                                className="inline-flex h-10 items-center rounded-control border border-border px-4 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
                            >
                                {t('ui.catalog.reset')}
                            </Link>
                        }
                    />
                )}
            </div>
        </>
    );
}
