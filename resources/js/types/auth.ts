export type User = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User | null;
};
