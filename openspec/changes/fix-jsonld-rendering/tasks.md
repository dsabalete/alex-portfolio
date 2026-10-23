# Tasks

## 1. Refactor structuredData.ts to return parsed schema objects

- [x] 1.1 Refactor `generateAllSchemas` to return an array of plain JSON schema objects (Person, Website, and route-specific content) instead of HTML `<script>` strings, and update `generatePersonSchema`/`generateWebsiteSchema`/`generateItemListSchema`/`generateAboutPageSchema`/`generateContactPageSchema` signatures if needed. Verify by running `npx tsc --noEmit` with no errors.
- [x] 1.2 Verify no remaining callers depend on the old `mainScript`/`fallback` string shape by running `grep -rn "mainScript\|fallback" src/pages src/hooks src/lib` and confirming only the intended page components reference the old fields.

## 2. Add JSON-LD injection to the useSEO hook

- [x] 2.1 Add a `seoJsonLd?: object[]` option to the `SEOOptions` interface in `src/hooks/useSEO.ts` and implement head injection of `<script type="application/ld+json">` blocks (using `JSON.stringify` with in-place updates keyed by a marker attribute). Verify by running `npx tsc --noEmit` with no errors.
- [x] 2.2 Verify existing head-tag handling is unaffected by running `npm run lint` and confirming no new warnings.

## 3. Update page components to pass schemas to useSEO and remove body-rendered scripts

- [x] 3.1 Update `HomePage.tsx` to pass the home route schemas to `useSEO` and remove `{mainScript}` and `{fallback}` JSX children. Verify by running `npm run lint` on the file with no errors.
- [x] 3.2 Update `AboutPage.tsx` to pass the /about route schemas to `useSEO` and remove `{mainScript}` and `{fallback}` JSX children. Verify by running `npm run lint` on the file with no errors.
- [x] 3.3 Update `ContactePage.tsx` to pass the /contacte route schemas to `useSEO` and remove `{mainScript}` and `{fallback}` JSX children. Verify by running `npm run lint` on the file with no errors.
- [x] 3.4 Check `NotFoundPage.tsx` for any `application/ld+json` usage (it had a raw `<script>` in JSX) and route it through `useSEO` or `generateAllSchemas` consistently, removing the visible script. Verify by running `npm run lint` on the file with no errors.

## 4. Build and visually verify

- [x] 4.1 Run `npm run build` and confirm the production build succeeds.
- [x] 4.2 Run `npm run dev` and visit `/`, `/about`, `/contacte`, and a 404 route; view page source / Elements panel in DevTools and confirm no raw JSON-LD text is visible in the body and `<script type="application/ld+json">` blocks are present in `<head>`.
