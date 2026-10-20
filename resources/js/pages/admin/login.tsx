import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';

export default function AdminLogin() {
    const { t } = useTranslation();
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    return (
        <>
            <Head title={t('admin.login.title')} />

            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-brand uppercase">
                    {t('admin.login.eyebrow')}
                </p>
                <h1 className="font-display text-4xl text-foreground">
                    {t('admin.login.title')}
                </h1>
                <p className="text-sm leading-relaxed text-foreground-muted">
                    {t('admin.login.subtitle')}
                </p>
            </div>

            <form
                className="mt-7 flex flex-col gap-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/admin/login', {
                        onFinish: () => form.reset('password'),
                    });
                }}
            >
                <Field
                    label={t('admin.login.email')}
                    htmlFor="email"
                    required
                    error={form.errors.email}
                >
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) =>
                            form.setData('email', event.target.value)
                        }
                        autoComplete="email"
                        autoFocus
                        invalid={Boolean(form.errors.email)}
                    />
                </Field>

                <Field
                    label={t('admin.login.password')}
                    htmlFor="password"
                    required
                    error={form.errors.password}
                >
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) =>
                            form.setData('password', event.target.value)
                        }
                        autoComplete="current-password"
                        invalid={Boolean(form.errors.password)}
                    />
                </Field>

                <label className="flex items-center gap-2 text-sm text-foreground-muted">
                    <input
                        type="checkbox"
                        checked={form.data.remember}
                        onChange={(event) =>
                            form.setData('remember', event.target.checked)
                        }
                        className="size-4 rounded border-border text-brand focus:ring-brand"
                    />
                    {t('admin.login.remember')}
                </label>

                <Button
                    type="submit"
                    size="lg"
                    isLoading={form.processing}
                    className="w-full"
                >
                    {t('admin.login.submit')}
                </Button>
            </form>

            <Link
                href="/"
                className="mt-6 inline-flex text-xs font-semibold text-foreground-muted hover:text-brand"
            >
                {t('admin.login.back')}
            </Link>
        </>
    );
}
