# Biwrawatch Design Specification

## Direction

Biwrawatch is a quiet luxury watch atelier: warm ivory paper, burgundy ink, champagne details, and editorial photography. The interface should feel calm and expensive, never loud or auction-like. Trust is the second brand pillar because every watch page leads to a shipment lookup.

Principles:

1. Photography first. Interface chrome stays restrained.
2. One clear action per view. Primary actions are rose; price is champagne.
3. Warm neutrals only. No electric blue, neon, glassmorphism, or heavy gradients.
4. Radius is intentional: 6px controls, 10px cards, 14px panels, 999px pills. Never 0.
5. Both public and admin support Light, Dark, and System themes.

## Typography

- Display: **Playfair Display** for editorial headings, watch names, and large numbers.
- UI/body: **Gabarito** for navigation, labels, forms, tables, and body copy.
- Prices and tracking numbers use `tabular-nums`.
- Display tracking: `-0.02em`. Uppercase labels: `0.08em`.

| Role    | Size / line-height | Weight |
| ------- | ------------------ | ------ |
| Display | 56 / 60            | 600    |
| H1      | 44 / 52            | 600    |
| H2      | 34 / 42            | 600    |
| H3      | 26 / 34            | 600    |
| H4      | 20 / 28            | 600    |
| Body    | 16 / 26            | 400    |
| Small   | 14 / 22            | 400    |
| Caption | 12 / 18            | 500    |
| Button  | 14 / 20            | 600    |

Use `text-balance` for headings and `text-pretty` for prose. Limit prose measure to 68 characters.

## Layout

- Container: `max-w-7xl`, 24px gutters, 1280px maximum.
- Section rhythm: 64px mobile, 96px desktop.
- Spacing scale: 4px base; use 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Public header: 72px, sticky, `surface/80` blur, bottom border.
- Admin shell: 260px sidebar, 64px topbar, 24px content padding.
- Mobile admin sidebar becomes a full-height drawer.
- Use CSS grid for catalog cards, not flex wrapping.

## Theme

- Modes: `light`, `dark`, `system`.
- Persist in `localStorage` under `biwrawatch-theme`.
- Apply `data-theme="light|dark"` to `<html>`.
- `system` follows `prefers-color-scheme`.
- Inline boot script prevents theme flash.
- Toggle is a 3-segment control with sun, moon, and monitor icons, `aria-pressed`, and Indonesian labels: Terang, Gelap, Sistem.
- Entire app, including login and admin, uses the same provider.

## Public Header

- Left: wordmark `BIWRAWATCH` in Playfair, small burgundy square mark.
- Center: Koleksi, Lacak Pengiriman, Tentang.
- Right: theme toggle, WhatsApp text button, mobile menu.
- Mobile: logo + theme toggle + menu; drawer contains nav and WhatsApp CTA.
- Active nav: rose text with a 2px bottom rule.

## Home

1. Hero: 7/5 split. Left editorial copy, primary CTA “Lihat Koleksi”, secondary “Lacak Pengiriman”. Right large watch image in a 10px card with a thin champagne frame and a small “Kurasi terbatas” chip.
2. Trust strip: 3 short proof points, separated by borders, no icons larger than 20px.
3. Featured collection: 3 or 6 watch cards, section heading + “Lihat semua”.
4. Tracking teaser: split panel with Storyset illustration, explanation, and inline tracking CTA.
5. Closing CTA: centered, warm surface panel, WhatsApp action.
6. Footer: brand statement, navigation, contact, credits, theme note.

## Catalog

- Header block: eyebrow “Koleksi”, H1, short paragraph, result count.
- Filter bar: submit-driven search, brand select, condition select, sort select, reset link. No live search.
- Desktop: filters in a single row above the grid. Mobile: “Filter” button opens a 14px panel.
- Grid: 1 column mobile, 2 tablet, 3 desktop. 24px gap.
- Empty state: Storyset illustration, short copy, reset action.
- Pagination: numbered on desktop, previous/next on mobile.

## Watch Card

- Surface card, 10px radius, 1px border, image `aspect-[4/5]`, `object-cover`.
- Top-left promo badge; top-right status badge if not available.
- Brand caption uppercase, watch name in Playfair, reference in muted caption.
- Price block: original price struck through, final price champagne gold, tabular.
- Hover: border to `brand/40`, translateY(-2px), image scale 1.02 over 240ms.
- Entire card is a link; no nested primary buttons.
- Sold watches stay visible if published: grayscale image, “Terjual” badge, no WhatsApp CTA on detail.

## Watch Detail

- Breadcrumb, two-column layout: 7/5.
- Left: main image + thumbnail rail. 10px radius, 1px border.
- Right: brand eyebrow, Playfair title, reference, price block, promo badge, short description, specification grid, WhatsApp primary action, shipping note.
- Specs: 2-column definition list with 1px dividers.
- Add a quiet “Butuh bantuan?” panel with WhatsApp link.
- Related watches: 3 cards.

## Tracking

### Index

- Split layout: left explanation and form, right Storyset illustration.
- Form: tracking number and phone, helper text explaining both internal `BW...` and provider numbers.
- Privacy note: “Data pengiriman hanya terbuka setelah verifikasi nomor telepon.”
- Error uses a generic message; never reveal whether the number exists.

### Verification

- Centered 480px panel on warm background.
- Tracking number shown in a monospace chip.
- Phone field with autofocus.
- Primary button “Buka Pengiriman”.
- Secondary “Lacak nomor lain”.
- No shipment details before verification.

### Shipment View

- Header: status badge, tracking number + copy button, live indicator, last update time.
- Summary card: provider primary, destination city, estimated delivery, masked recipient name.
- Timeline: vertical rail, status dot, occurred time, location, note. Current step highlighted. Public events only.
- Provider history: primary provider with external link, then older providers with numbers and links.
- Real-time: partial Inertia reload on `ShipmentStatusUpdated`; fallback manual refresh.
- `noindex, nofollow`.
- Mobile: summary card stacks above timeline.

## Admin

- Sidebar: brand mark, Dashboard, Jam, Promo, Provider, Pengiriman, “Lihat situs”, logout.
- Topbar: page title, theme toggle, admin name.
- Tables: 56px rows, sticky header, muted uppercase labels, row hover, status badges, actions right-aligned.
- Forms: max-width 760px, 2-column grid on desktop, single column mobile, sticky footer actions.
- Destructive actions use a 14px confirmation dialog, never `window.confirm` for shipment/provider changes.
- Shipment detail: summary, status update form, provider tracking manager, public timeline preview.
- Empty states use small Storyset illustrations, not large decorative panels.

## Components

### Buttons

- Height 44px, padding 16px, 6px radius, 14px/600.
- Primary: brand background, white text. Hover brand-hover.
- Secondary: surface, 1px border, foreground. Hover surface-muted.
- Ghost: transparent, foreground-muted. Hover surface-muted.
- Destructive: danger background for destructive confirmation only.
- Focus: 2px ring, 2px offset.

### Inputs

- Height 44px, 6px radius, surface, 1px border, 14px text.
- Focus: border brand + 2px brand/20 ring.
- Error: danger border + 12px error text.
- Labels 14px/600; helper 12px muted.

### Badges

- Height 24px, pill radius, 12px/600, 8px horizontal padding.
- Promo: brand-soft + brand.
- Status mapping follows `COLORS.md`.
- Live: dot + `live` text on surface.

### Price

- Final price: 20px/600 champagne gold, tabular.
- Original: 14px muted, line-through.
- Discount: 12px brand-soft pill.

### Cards and Panels

- Card: surface, 10px radius, border, no heavy shadow.
- Panel: surface, 14px radius, border; used for dialogs, mobile filters, tracking summary.
- Section surface: `surface-muted`, 14px radius, 32px padding.

### Timeline

- 2px vertical border rail.
- Dot 12px; completed uses brand, current uses live with a soft pulse, future uses border-strong.
- Time 12px muted; location 14px/600; note 14px muted.
- Connector spacing 24px.

## Motion

- Micro interactions: 160ms ease-out.
- Image hover: 240ms ease-out.
- No parallax, no scroll-jacking.
- Respect `prefers-reduced-motion: reduce`; disable transforms and pulses.

## Imagery

- Watch photography: warm, low-key, neutral background, no visible logos for demo assets.
- Hero and cards use local WebP files under `public/images/demo/watches`.
- Illustrations: Storyset, recolored to rose/plum/champagne, local SVG under `public/images/illustrations`.
- Illustration uses: tracking verification, tracking not found, empty catalog, empty admin, tracking teaser.
- Every image has meaningful alt text; decorative illustrations use empty alt.
- Credit Unsplash photographers and Storyset on `/credits` and in `CREDITS.md`.

## Accessibility

- Skip link to main content.
- Visible focus rings on every interactive element.
- Form labels are always visible; no placeholder-only labels.
- Status is never conveyed by color alone; include text.
- Timeline updates use `aria-live="polite"`.
- Touch targets at least 44px.
- Dark mode contrast checked for all badges and buttons.
- Support 200% zoom without horizontal scroll.

## Do

- Use generous whitespace and editorial hierarchy.
- Let one watch image dominate each composition.
- Use champagne sparingly for price and premium cues.
- Keep admin functional and calm; reuse public tokens.
- Use Indonesian copy with sentence case.

## Don't

- Don’t use auction timers, bid buttons, or “highest bidder” language.
- Don’t use electric blue, purple gradients, neon, or glass cards.
- Don’t use radius 0.
- Don’t use gold for long body text.
- Don’t use live search or infinite scrolling for the catalog.
- Don’t expose recipient name, phone, or address in public tracking.
