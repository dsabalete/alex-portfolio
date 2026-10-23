# Proposal

## Why

JSON-LD structured data (`application/ld+json`) is currently rendered as **visible text** on the page instead of being injected into `<head>`. The `useSEO` hook manages most metadata via `document.head`, but JSON-LD is emitted by placing raw HTML strings (`mainScript`/`fallback` from `generateAllSchemas`) as JSX children in page components. React renders string children as escaped text, so the JSON-LD is shown to users and is **not** parsed by search engines as structured data.

## What Changes

- Remove the `mainScript` and `fallback` JSX children from `HomePage`, `AboutPage`, `ContactePage`, and `NotFoundPage`.
- Inject JSON-LD `<script type="application/ld+json">` blocks into `document.head` instead of rendering them as body content, so they are parsed by search engines and invisible to users.
- Extend the `useSEO` hook (or add a dedicated JSON-LD injection path within it) to manage JSON-LD `<script>` tags in `<head>` with in-place updates (no duplicates), consistent with how other head tags are handled.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `seo-social-metadata`: The "Dynamic Schema.org structured data from project data" requirement now includes the constraint that JSON-LD blocks SHALL be injected into `document.head` (not rendered as body content) so they remain invisible to users and parseable as structured data, and SHALL be managed with in-place updates to avoid duplicates.

## Impact

- `src/hooks/useSEO.ts`: Add JSON-LD script injection to `<head>`.
- `src/lib/structuredData.ts`: Adjust the schema generator output format (return parsed objects/strings rather than full `<script>` strings) to support head injection.
- `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/ContactePage.tsx`, `src/pages/NotFoundPage.tsx`: Remove `{mainScript}` / `{fallback}` body children.
