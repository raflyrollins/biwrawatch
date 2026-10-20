# RULES.md — Project Rules

Durable rules for Biwrawatch. These constrain all future work, not a single change. If
code conflicts with a rule here, the rule wins and the code gets fixed.

`AGENTS.md` covers _how to work in this repo_ (commands, verification order, toolchain
quirks). This file covers _what the code must look like_.

---

## 1. UUID in URLs

Any table whose rows appear in a URL carries a `uuid` column. `id` stays the primary
key; `uuid` is a separate `unique()` column placed **directly after `id`** in the
migration, and it is what route model binding resolves.

Tables with a UUID: `users`, `watches`, `promotions`, `shipping_providers`, and
`shipments`. Tables that do not appear in a URL get **no** uuid: `watch_images`,
`shipment_trackings`, and `shipment_events`.

### Using it on a model

`HasUuids` alone does **not** work here. `HasUniqueStringIds::uniqueIds()` returns
`[$this->getKeyName()]`, so with `id` as the primary key it fills the uuid _into_ the
`id` column. Use the `HasUuidRouteKey` trait instead.

```php
use App\Concerns\HasUuidRouteKey;

class Shipment extends Model
{
    use HasUuidRouteKey;
}
```

### In a migration

```php
$table->id();
$table->uuid('uuid')->unique()->after('id');
```

`unique()` is also the index. Do not add a separate `->index()` on top of it.

---

## 2. Code and URLs are English; only the UI is Indonesian

Written **English**: class names, method and variable names, route names, route
parameters, table and column names, enum cases, config keys, translation file names,
commit messages, code comments.

Written **Indonesian**: user-facing string values only, and those live in `lang/id/`,
never inline in a component. `APP_LOCALE=id`, `APP_FALLBACK_LOCALE=en`.

Watch names, promotion labels, and shipment notes are Indonesian **data**, not code.
That is content, not a violation.

---

## 3. Index everything that joins or gets searched

- Every foreign key column gets an explicit `->index()`. PostgreSQL does **not** auto-index
  foreign keys, so `foreignId()->constrained()` alone leaves you with a sequential scan on
  every join.
- Text-search columns are declared once in `config/search.php` and reused by the
  migration and `WatchSearch`, so the two can never drift.
- The generated `watches.search_vector` column is weighted across brand, model,
  reference, description, and keywords; it has a GIN index.

### `->index()` must come before `->constrained()`

`ForeignIdColumnDefinition::constrained()` returns a `ForeignKeyDefinition`, **not** the
column. Every method chained after it therefore acts on the constraint, not the column:

```php
// WRONG — builds a mis-named constraint, not a column index.
$table->foreignId('user_id')->constrained()->cascadeOnDelete()->index();

// RIGHT
$table->foreignId('user_id')->index()->constrained()->cascadeOnDelete();
```

The same applies to nullable FKs:
`->index()->constrained('users')->nullOnDelete()` is correct.

---

## 4. No live search; all search is full-text

- Every public catalog search goes through `WatchSearch` and the PostgreSQL full-text
  vector. No `LIKE '%…%'`, no `whereRaw` with `ILIKE`, no in-memory filtering over a
  fetched collection.
- Search is submit-driven. No debounced as-you-type requests, no keystroke handlers
  firing HTTP.
- Terms use prefix matching (`term:*`) joined with OR, and results are ordered by
  `ts_rank_cd` relevance unless the user picks a different sort.
- The text-search language is `indonesian`, read from `config/search.php`. It is a real
  PostgreSQL text-search configuration and must stay in sync with the migration.
- Search tests require PostgreSQL. Never run them against SQLite.

---

## 5. No hardcoding

| Instead of                                 | Use                                                        |
| ------------------------------------------ | ---------------------------------------------------------- |
| `'BW'` and sequence width in tracking      | `config('shipping.tracking_prefix')` and `sequence_length` |
| `tracking.{id}` channel strings            | build from `tracking.` + `uuid` consistently               |
| `now()->addMinutes(30)` access TTL         | `config('shipping.verification_ttl_minutes')`              |
| `'pending'`, `'in_transit'`, `'delivered'` | `App\Enums\ShipmentStatus`                                 |
| `'pre_owned'`, `'available'`               | `App\Enums\WatchCondition` / `WatchStatus`                 |
| `'Rp '` currency prefixes                  | `Number::currency()` with `config('site.currency')`        |
| `'indonesian'` in a query                  | `config('search.language')`                                |
| search column lists                        | `config/search.php`                                        |
| `is_admin` checks scattered inline         | the `admin` middleware or `User::isAdmin()`                |

Anything that appears in more than one place, or that an operator might need to change
without a code edit, belongs in `config/`.

---

## 6. Shipment tracking

- The internal tracking number is immutable after creation: `BW{YYYYMMDD}{00001}`,
  generated atomically from `tracking_counters`. Never derive it from the row id.
- A shipment may have multiple provider tracking numbers over time, but exactly one is
  primary. Setting a new primary clears the old one in the same transaction.
- Provider tracking numbers are globally unique.
- Public lookup accepts the internal number or any historical provider number, but the
  canonical URL is always `/track/{internal_tracking_number}`.
- Public tracking data is never rendered until the recipient phone is verified. Phone
  comparison uses `PhoneNormalizer` and `hash_equals`; the error message is always the
  generic `tracking.invalid_credentials`.
- Access is session-based for the configured TTL, and public tracking pages are
  `noindex, nofollow`.

---

## 7. Promotion pricing

- Promotions are either percentage, fixed, or badge-only. Never stack discounts; the
  best active final price wins.
- `applies_to_all` beats a selected-watch list; a selected promotion only applies when
  the watch is attached through the pivot.
- A badge-only promotion never changes the price. If a discount exists, the badge comes
  from the best discounting promotion.
- All pricing decisions belong in `WatchPricing`; controllers and presenters must not
  reimplement the math.
