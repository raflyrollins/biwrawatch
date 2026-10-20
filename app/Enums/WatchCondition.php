<?php

namespace App\Enums;

enum WatchCondition: string
{
    case New = 'new';
    case PreOwned = 'pre_owned';
    case Vintage = 'vintage';

    public function label(): string
    {
        return __('watch.condition.'.$this->value);
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $condition): array => [$condition->value => $condition->label()])
            ->all();
    }
}
