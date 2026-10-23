# Proposal

## Why

The project has two detailed specification documents in `.kiro/specs/` (a bugfix for mobile video interaction and a feature for SEO/social branding) that were authored in the Kiro requirements-first format. These specs contain well-formed requirements, design rationale, and task breakdowns, but they live outside the OpenSpec framework that this project now uses. Migrating them into OpenSpec preserves the planning investment while making the specs discoverable, versioned, and actionable through the OpenSpec workflow.

## What Changes

- Convert the two `.kiro/specs/` documents into OpenSpec artifacts (proposal, specs, design, tasks) under `openspec/changes/migrate-kiro-specs-to-openspec/`.
- Create two new capability specs in `openspec/specs/`:
  - `mobile-video-interaction` — capturing the bugfix requirements (viewport-based playback, playsInline, promise rejection handling, title visibility) and preservation requirements.
  - `seo-social-metadata` — capturing the SEO feature requirements (dynamic OG images, canonical URLs, structured data, 404 SEO handling).
- Retire the `.kiro/specs/` directory once the OpenSpec artifacts are validated and the change is archived.

## Capabilities

### New Capabilities

- `mobile-video-interaction`: Video playback behavior for Presentation and ProjectCard components on touch devices, including IntersectionObserver-based viewport autoplay, iOS Safari `playsInline` support, graceful `play()` promise rejection handling, and ProjectCard overlay visibility during active states. Covers both bug-condition requirements and preservation requirements.
- `seo-social-metadata`: SEO management for the portfolio site, including route-specific Open Graph preview images, canonical URLs and `og:url` generation, dynamic JSON-LD structured data derived from `projects.json`, and 404 page SEO handling (noindex).

### Modified Capabilities

- (none — no existing OpenSpec specs cover these behaviors)

## Impact

- `openspec/specs/mobile-video-interaction/spec.md` — new capability spec
- `openspec/specs/seo-social-metadata/spec.md` — new capability spec
- `.kiro/specs/mobile-video-interaction-fix/` — archived after migration
- `.kiro/specs/seo-social-branding/` — archived after migration
- No immediate code changes; this change is purely specification migration. Implementation is already complete per the Kiro documents.