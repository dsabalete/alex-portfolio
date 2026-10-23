# Spec Delta

## MODIFIED Requirements

### Requirement: Dynamic Schema.org structured data from project data
WHEN a Route renders THEN the system SHALL emit JSON-LD structured data derived from `src/data/projects.json` as the single source of truth INTO `document.head` as `<script type="application/ld+json">` elements that are invisible to users and parseable by search engines, and SHALL manage those elements with in-place updates to avoid duplicates.

#### Scenario: JSON-LD is injected into head, not rendered as body content
- **WHEN** a Route renders
- **THEN** the system SHALL inject `<script type="application/ld+json">` blocks into `document.head`
- **AND** SHALL NOT render JSON-LD content as visible text in the document body

#### Scenario: HomePage structured data
- **WHEN** the `/` (HomePage) route renders
- **THEN** the system SHALL emit `ItemList` (with `CreativeWork` entries derived from `projects.json`), `Person`, and `WebSite` JSON-LD blocks into `document.head`

#### Scenario: AboutPage structured data
- **WHEN** the `/about` (AboutPage) route renders
- **THEN** the system SHALL emit `ProfilePage` (or `AboutPage`), `Person`, and `WebSite` JSON-LD blocks into `document.head`

#### Scenario: ContactePage structured data
- **WHEN** the `/contacte` (ContactePage) route renders
- **THEN** the system SHALL emit `ContactPage` (with email and Instagram contact details), `Person`, and `WebSite` JSON-LD blocks into `document.head`

#### Scenario: NotFoundPage structured data
- **WHEN** the NotFoundPage renders
- **THEN** the system SHALL emit only `Person` and `WebSite` JSON-LD blocks into `document.head` without portfolio items

#### Scenario: In-place update avoids duplicate JSON-LD scripts
- **WHEN** a Route re-renders or the user navigates between routes
- **THEN** the system SHALL update existing `<script type="application/ld+json">` elements in `document.head` in place without appending duplicate elements

#### Scenario: Data round-trip serialization
- **WHEN** project data is serialized to JSON-LD
- **THEN** the output SHALL be valid JSON that parses back into equivalent project fields
