import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            locale: string;
            translations: Record<string, string>;
            flash: {
                success?: string;
                error?: string;
            };
            [key: string]: unknown;
        };
    }
}
