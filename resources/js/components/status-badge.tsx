import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const variants: Record<string, BadgeVariant> = {
    pending: 'neutral',
    picked_up: 'info',
    in_transit: 'brand',
    customs: 'warning',
    out_for_delivery: 'accent',
    delivered: 'success',
    exception: 'danger',
    returned: 'neutral',
    cancelled: 'outline',
};

export function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const { t } = useTranslation();

    return (
        <Badge
            variant={variants[status] ?? 'neutral'}
            className={cn('gap-1.5', className)}
        >
            <span className="size-1.5 rounded-pill bg-current" />
            {t(`shipment.status.${status}`)}
        </Badge>
    );
}
