# Design

## Context

The repository contains two specification sets authored in Kiro format under `.kiro/specs/`:
1. `mobile-video-interaction-fix`: Bugfix spec for `Presentation.tsx`, `ProjectCard.tsx`, and CSS modules (`ProjectCard.module.css`).
2. `seo-social-branding`: Feature spec for SEO, dynamic OG images, canonical URLs, and Schema.org JSON-LD structured data.

Both features have already been fully implemented and verified in the React codebase (`src/components/Presentation.tsx`, `src/components/ProjectCard.tsx`, `src/hooks/useSEO.ts`, `src/lib/seo.ts`). This change migrates the specifications themselves into OpenSpec format to establish OpenSpec as the single source of truth for portfolio behavior.

See `proposal.md` for background and scope.

## Goals / Non-Goals

**Goals:**
- Port requirements and architectural context from `.kiro/specs/` into OpenSpec capability specs (`openspec/specs/mobile-video-interaction/spec.md` and `openspec/specs/seo-social-metadata/spec.md`).
- Define the transition tasks to register, validate, and sync the specs into main OpenSpec capabilities.
- Remove legacy `.kiro/specs/` artifacts once OpenSpec specs are validated and synced.

**Non-Goals:**
- Modifying React components or CSS code (code changes are already complete and tested).
- Introducing new runtime dependencies or build steps.

## Decisions

### Decision 1: Map Kiro specs to two distinct OpenSpec capabilities

- **Choice**: Map `mobile-video-interaction-fix` to `specs/mobile-video-interaction/spec.md` and `seo-social-branding` to `specs/seo-social-metadata/spec.md`.
- **Rationale**: Keeps capability scopes clean and modular. `mobile-video-interaction` handles media/UI behaviors while `seo-social-metadata` handles head tags and metadata generators.
- **Alternatives Considered**: Combining both into a single `portfolio-features` spec — rejected because video interaction and SEO metadata are independent concerns.

### Decision 2: Sync delta specs to main specs during workflow

- **Choice**: Write delta specs in `openspec/changes/migrate-kiro-specs-to-openspec/specs/` and use `openspec archive` to automatically sync them to `openspec/specs/`.
- **Rationale**: standard OpenSpec lifecycle ensures all delta specs promote to primary capability specs in `openspec/specs/`.
- **Alternatives Considered**: Hand-writing directly into `openspec/specs/` — rejected because standard OpenSpec workflow tracks change deltas through changes directory before sync.

### Decision 3: Remove legacy `.kiro/specs/` post-migration

- **Choice**: Delete the `.kiro/specs/` folder after validating the OpenSpec specs and archiving the change.
- **Rationale**: Eliminates duplicate specification sources and prevents confusion for future agent runs or maintainers.

## Risks / Trade-offs

- **[Risk] Sync validation failure during archive** → **Mitigation**: Run `openspec validate` before archiving to ensure all requirement and scenario formats adhere strictly to OpenSpec schema guidelines.
- **[Risk] Loss of historical Kiro context** → **Mitigation**: Ensure all requirements, edge-case scenarios, and preservation criteria from Kiro files are fully preserved in OpenSpec capability specs before deleting `.kiro/specs/`.

## Migration Plan

1. Verify OpenSpec delta specs (`specs/mobile-video-interaction/spec.md`, `specs/seo-social-metadata/spec.md`) cover all requirements from `.kiro/specs/`.
2. Validate the change with `openspec validate`.
3. Clean up `.kiro/specs/` directory.
4. Archive the change with `openspec archive --yes` (or `/opsx-archive`) to sync delta specs into main capability specs.
