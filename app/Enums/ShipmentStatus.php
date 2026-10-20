<?php

namespace App\Enums;

enum ShipmentStatus: string
{
    case Pending = 'pending';
    case PickedUp = 'picked_up';
    case InTransit = 'in_transit';
    case Customs = 'customs';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case Exception = 'exception';
    case Returned = 'returned';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return __('shipment.status.'.$this->value);
    }

    public function rank(): int
    {
        return match ($this) {
            self::Pending => 0,
            self::PickedUp => 1,
            self::InTransit => 2,
            self::Customs => 3,
            self::OutForDelivery => 4,
            self::Delivered => 5,
            self::Exception => 6,
            self::Returned => 7,
            self::Cancelled => 8,
        };
    }

    public function isBackwardFrom(self $current): bool
    {
        return $this->rank() < $current->rank();
    }

    public function isForwardJumpFrom(self $current): bool
    {
        return $this->rank() > $current->rank() + 1;
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Delivered, self::Returned, self::Cancelled], true);
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $status): array => [$status->value => $status->label()])
            ->all();
    }
}
