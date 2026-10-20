# Biwrawatch Color System

Rose burgundy, warm ivory, and champagne gold. The palette is deliberately quiet: the watch photography supplies the saturation, while the interface stays warm, editorial, and trustworthy.

## Principles

- Use semantic tokens, never raw hex values in components.
- Brand rose is for primary actions, active navigation, and promotional emphasis.
- Champagne gold is reserved for price, premium accents, and live highlights.
- Neutrals are warm, never pure gray.
- Text must meet WCAG AA: 4.5:1 for body text, 3:1 for large text and UI boundaries.
- Dark mode is a real theme, not an inverted light theme. Borders carry more of the hierarchy in dark mode.

## Semantic Tokens

| Token               | Light                    | Dark                  | Use                               |
| ------------------- | ------------------------ | --------------------- | --------------------------------- |
| `background`        | `#FBF7F5`                | `#120B10`             | Page background                   |
| `surface`           | `#FFFFFF`                | `#1B1118`             | Cards, sheets, inputs             |
| `surface-muted`     | `#F5EDEA`                | `#241821`             | Secondary panels, table headers   |
| `surface-strong`    | `#EFE3DE`                | `#2D1D27`             | Hover rows, selected filters      |
| `foreground`        | `#241018`                | `#F6EDF0`             | Primary text                      |
| `foreground-muted`  | `#6E5A63`                | `#B9A6AE`             | Secondary text                    |
| `foreground-subtle` | `#8C7780`                | `#917D86`             | Captions, metadata                |
| `border`            | `#E8DAD5`                | `#3A2832`             | Default borders                   |
| `border-strong`     | `#D8C4BD`                | `#4C3541`             | Emphasized borders, dividers      |
| `brand`             | `#A62E5A`                | `#B23A63`             | Primary action, active nav        |
| `brand-hover`       | `#8E254C`                | `#C64A74`             | Primary hover                     |
| `brand-soft`        | `#F6DDE6`                | `#3A1C29`             | Promo badges, selected nav        |
| `brand-foreground`  | `#FFFFFF`                | `#FFFFFF`             | Text on brand                     |
| `accent`            | `#8A6420`                | `#E8C77A`             | Prices, premium accents           |
| `accent-soft`       | `#F3E6C8`                | `#3A2B13`             | Price highlights, featured marker |
| `accent-foreground` | `#241A08`                | `#241A08`             | Text on accent                    |
| `success`           | `#2F6B4F`                | `#6FBF95`             | Delivered, success                |
| `success-soft`      | `#DDF0E5`                | `#163326`             | Success badge background          |
| `warning`           | `#9A6200`                | `#E4B45C`             | Customs, pending attention        |
| `warning-soft`      | `#F8E8C7`                | `#3A2B13`             | Warning badge background          |
| `danger`            | `#B3263B`                | `#E06A7A`             | Exception, destructive            |
| `danger-soft`       | `#F8DDE1`                | `#3A1A20`             | Error badge background            |
| `info`              | `#315C8A`                | `#7FA9D6`             | Informational state               |
| `info-soft`         | `#DDE8F5`                | `#182A3D`             | Info badge background             |
| `live`              | `#2F6B4F`                | `#6FBF95`             | Live connection indicator         |
| `ring`              | `#A62E5A`                | `#E8C77A`             | Focus ring                        |
| `overlay`           | `rgba(36, 16, 24, 0.48)` | `rgba(0, 0, 0, 0.64)` | Modal backdrop                    |

## Status Mapping

| Shipment status    | Token                                  |
| ------------------ | -------------------------------------- |
| `pending`          | `surface-strong` / `foreground-muted`  |
| `picked_up`        | `info-soft` / `info`                   |
| `in_transit`       | `brand-soft` / `brand`                 |
| `customs`          | `warning-soft` / `warning`             |
| `out_for_delivery` | `accent-soft` / `accent`               |
| `delivered`        | `success-soft` / `success`             |
| `exception`        | `danger-soft` / `danger`               |
| `returned`         | `surface-strong` / `foreground-muted`  |
| `cancelled`        | `surface-strong` / `foreground-subtle` |

## Contrast Notes

- Light: `foreground` on `background` is above 15:1; `foreground-muted` on `background` is above 5:1.
- Light: `brand-foreground` on `brand` is above 6:1; `accent` on `surface` is above 5:1.
- Dark: `foreground` on `background` is above 14:1; `foreground-muted` on `background` is above 7:1.
- Dark: `brand` on `background` is above 4.5:1; `accent` on `background` is above 10:1.
- Never place `foreground-subtle` on `surface-muted` for essential copy.
- Never use opacity to create secondary text. Use the muted tokens.

## Prohibited

- Electric blue, violet gradients, neon glows, glassmorphism, pure black `#000`, pure gray `#808080`.
- Hardcoded colors such as `bg-[#A62E5A]` in components.
- Rose text on rose-soft backgrounds without checking contrast.
- Gold body text on light ivory; gold is for price and large accents only.
- More than one brand-colored primary action in the same view.
