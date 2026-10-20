export type LocalizedOption = {
    value: string;
    label: string;
};

export type WatchImage = {
    id: number;
    path: string;
    url: string;
    alt: string;
    sort_order: number;
};

export type WatchPricing = {
    original_price: number;
    final_price: number;
    discount_amount: number;
    promotion: {
        id: number;
        name: string;
        label: string | null;
    } | null;
};

export type WatchCard = {
    id: number;
    uuid: string;
    brand: string;
    model: string;
    reference_number: string;
    year: number | null;
    condition: LocalizedOption;
    status: LocalizedOption;
    price: number;
    pricing: WatchPricing;
    is_featured: boolean;
    image: WatchImage | null;
    url: string;
};

export type WatchDetail = WatchCard & {
    description: string | null;
    movement: string | null;
    case_material: string | null;
    case_diameter_mm: number | null;
    dial_color: string | null;
    strap_material: string | null;
    images: WatchImage[];
    whatsapp_url: string | null;
};

export type WatchAdminSummary = WatchCard & {
    is_published: boolean;
    sort_order: number;
    created_at: string | null;
};

export type WatchAdmin = WatchDetail & {
    is_published: boolean;
    sort_order: number;
    search_keywords: string | null;
    promotions: Array<{
        id: number;
        name: string;
        label: string | null;
    }>;
    created_at: string | null;
    updated_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginator<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export type PromotionSummary = {
    id: number;
    uuid: string;
    name: string;
    label: string | null;
    discount_type: string | null;
    discount_type_label: string | null;
    discount_value: number | null;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    applies_to_all: boolean;
    priority: number;
    watches_count: number;
};

export type PromotionForm = PromotionSummary & {
    description: string | null;
    watch_ids: number[];
};

export type ProviderOption = {
    id: number;
    name: string;
    tracking_number_pattern: string | null;
};

export type ProviderSummary = {
    id: number;
    uuid: string;
    name: string;
    tracking_url_template: string;
    tracking_number_pattern: string | null;
    is_active: boolean;
    sort_order: number;
    trackings_count: number;
    created_at: string | null;
};

export type ShipmentSummary = {
    uuid: string;
    tracking_number: string;
    recipient_name: string;
    destination_city: string;
    status: LocalizedOption;
    last_status_at: string | null;
    created_at: string | null;
};

export type ShipmentTracking = {
    id: number;
    provider_id: number;
    provider_name: string;
    tracking_number: string;
    tracking_url: string | null;
    is_primary: boolean;
    added_at: string;
    notes: string | null;
};

export type ShipmentEvent = {
    id: number;
    status: LocalizedOption;
    location: string | null;
    note: string | null;
    occurred_at: string;
    is_public?: boolean;
    creator?: string | null;
};

export type ShipmentDetail = {
    uuid: string;
    tracking_number: string;
    status: LocalizedOption;
    recipient_name: string;
    destination_city: string;
    destination_country: string;
    estimated_delivery_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    last_status_at: string | null;
    primary_tracking: ShipmentTracking | null;
    trackings: ShipmentTracking[];
    events: ShipmentEvent[];
    recipient_phone: string;
    recipient_address: string;
    internal_notes: string | null;
    created_at: string | null;
    updated_at: string | null;
};
