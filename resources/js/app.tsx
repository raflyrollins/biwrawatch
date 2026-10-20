import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { ThemeProvider } from '@/components/theme-provider';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Biwrawatch';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#A62E5A',
    },
    layout: (name) => {
        if (name === 'admin/login') {
            return AuthLayout;
        }

        if (name.startsWith('admin/')) {
            return AdminLayout;
        }

        return PublicLayout;
    },
    withApp(app) {
        return <ThemeProvider>{app}</ThemeProvider>;
    },
});
