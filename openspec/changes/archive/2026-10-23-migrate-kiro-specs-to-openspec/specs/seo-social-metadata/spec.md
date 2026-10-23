# Spec Delta

## Purpose

Provides SEO management, route-specific Open Graph preview images, canonical URLs, JSON-LD structured data derived from project data, and 404 page noindex handling for the portfolio site.

## ADDED Requirements

### Requirement: Dynamic Open Graph preview images by route

WHEN the SEO_Manager is invoked for a Route THEN the system SHALL update `og:image` and `twitter:image` meta tags to a route-appropriate preview image or default poster.

#### Scenario: Route with explicit OG image
- **WHEN** the SEO_Manager is invoked with an OG_Preview_Image for a Route
- **THEN** the system SHALL set `og:image` and `twitter:image` to that image URL, and `og:image:width`/`og:image:height` to 1200 and 630

#### Scenario: Route without explicit OG image
- **WHEN** the SEO_Manager is invoked without an explicit OG_Preview_Image
- **THEN** the system SHALL set `og:image` and `twitter:image` to the Default_Reel_Poster

#### Scenario: HomePage OG image
- **WHEN** the `/` (HomePage) route renders
- **THEN** the system SHALL use the Default_Reel_Poster as the OG_Preview_Image

#### Scenario: AboutPage OG image
- **WHEN** the `/about` (AboutPage) route renders
- **THEN** the system SHALL use Àlex Sabalete's profile photo as the OG_Preview_Image

#### Scenario: Route change updates OG image
- **WHEN** the user navigates from one Route to another
- **THEN** the system SHALL update `og:image` and `twitter:image` to reflect the new Route's OG_Preview_Image

### Requirement: Canonical URLs and og:url generation

WHEN the SEO_Manager is invoked for a Route AND `VITE_SITE_URL` is configured THEN the system SHALL set the `<link rel="canonical">` and `og:url` meta tags.

#### Scenario: Canonical URL set when VITE_SITE_URL present
- **WHEN** `VITE_SITE_URL` is set and the user renders a Route
- **THEN** the system SHALL set `<link rel="canonical">` href and `og:url` content to `VITE_SITE_URL` + route path

#### Scenario: Canonical URL omitted when VITE_SITE_URL missing
- **WHEN** `VITE_SITE_URL` is empty or undefined
- **THEN** the system SHALL omit `<link rel="canonical">` and `og:url` tags

#### Scenario: Route change updates canonical URL
- **WHEN** the user navigates to a new Route
- **THEN** the system SHALL update the `<link rel="canonical">` href and `og:url` content to match the new route path

### Requirement: Dynamic Schema.org structured data from project data

WHEN a Route renders THEN the system SHALL emit JSON-LD structured data derived from `src/data/projects.json` as the single source of truth.

#### Scenario: HomePage structured data
- **WHEN** the `/` (HomePage) route renders
- **THEN** the system SHALL emit `ItemList` (with `CreativeWork` entries derived from `projects.json`), `Person`, and `WebSite` JSON-LD blocks

#### Scenario: AboutPage structured data
- **WHEN** the `/about` (AboutPage) route renders
- **THEN** the system SHALL emit `ProfilePage` (or `AboutPage`), `Person`, and `WebSite` JSON-LD blocks

#### Scenario: ContactePage structured data
- **WHEN** the `/contacte` (ContactePage) route renders
- **THEN** the system SHALL emit `ContactPage` (with email and Instagram contact details), `Person`, and `WebSite` JSON-LD blocks

#### Scenario: NotFoundPage structured data
- **WHEN** the NotFoundPage renders
- **THEN** the system SHALL emit only `Person` and `WebSite` JSON-LD blocks without portfolio items

#### Scenario: Data round-trip serialization
- **WHEN** project data is serialized to JSON-LD
- **THEN** the output SHALL be valid JSON that parses back into equivalent project fields

### Requirement: 404 page SEO and noindex management

WHEN the NotFoundPage renders THEN the system SHALL set 404-specific title and description meta tags and inject a `noindex` robots tag, removing it on subsequent valid route navigation.

#### Scenario: 404 page injects noindex
- **WHEN** the NotFoundPage renders
- **THEN** the system SHALL set title/description to 404 specifics and inject `<meta name="robots" content="noindex">`

#### Scenario: Navigation away removes noindex
- **WHEN** the user navigates from NotFoundPage to a valid Route
- **THEN** the system SHALL remove the `noindex` tag so the valid route remains indexable

### Requirement: SEO head tag preservation

WHEN updating head tags THEN the system SHALL update existing tags in place rather than creating duplicates, preserving static Open Graph and Twitter metadata.

#### Scenario: In-place update avoids duplicates
- **WHEN** the SEO_Manager updates a meta tag that already exists in `document.head`
- **THEN** it SHALL update the existing tag's attributes without appending a duplicate element

#### Scenario: Preservation of static metadata
- **WHEN** any Route renders
- **THEN** static tags (`og:type`, `og:site_name`, `og:locale`, `twitter:card="summary_large_image"`) SHALL remain unchanged