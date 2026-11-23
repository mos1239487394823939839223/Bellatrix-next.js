# Bellatrix site: architecture

Next.js (App Router) front end for bellatrixinc.com. Page content comes from the .NET
API (`/api`), and an admin panel edits it. Pages are made of **sections** that the CMS
arranges.

## Where things live

| Folder | Holds | Rule |
|---|---|---|
| `app/` | Routes: public pages, `[slug]` CMS pages, `/admin`, `/auth`, `/privacy`, `/contact`, `/healthz`, `sitemap`, `robots` | Route files stay thin and render components from `src/` |
| `src/core/http` | `HttpClient` (fetch, timeouts, `{success,data}` unwrapping), `ApiError`, `TokenStore` | The only code that talks HTTP or touches auth tokens |
| `src/core/validation` | `Validator` and rule schemas (contact, page, category, media, password, settings), `sectionContent` (any section's content) | Validate before sending; services call these too |
| `src/services` | `index.js` container; `domain.js` service classes (Pages, Components, Media, Messages, Categories, Settings, Auth, Dashboard); `StaticContentRepository` | Components use `services.*`, never `fetch` directly |
| `src/services/legacy` | Older API modules (`pagesAPI`, `settingsApi`, `mediaAPI`…) kept for existing screens | Thin wrappers over the HttpClient; move screens to `services.*` over time |
| `src/sections` | `sections.js` (the one list of sections), `registry.js` (lookup and loading), renderer adapters (`componentMap`, `ssrComponentMap`, `previewRegistry`), `schemas/` (admin form fields per section) | A section is registered **once**, in `sections.js` |
| `src/components` | UI: site sections (About/, solution/, industries/, Services/, Support/…), shared UI (`UI/`), admin UI (`Admin/`) | Presentational; data comes from props or services |
| `src/views` | Screen-level components used by `app/` routes (admin screens, auth screens) | |
| `src/contexts` | React contexts and providers (theme, CTA modal, admin, data) | |
| `src/hooks` | Reusable hooks (`useAuth`, `useBackgroundVideo`…) | |
| `src/config` | Configuration (API base URLs, settings field map, toast) | |
| `src/lib` | Server-side SEO helpers (`seo.js`, `pageMeta.js`) | |
| `src/utils` | Pure helpers (sanitizer, normalizeProps, cache busting…) | No React, no HTTP |
| `src/store` | Redux slices used by older screens | |
| `src/styles` | Theme and animation CSS | |

## Adding a page section

1. Create the component in `src/components/...`.
2. Add one line to `src/sections/sections.js` with its `path`, the `types` shown in the admin catalog, and its `load`.
3. Add its admin form fields to `src/sections/schemas/generalComponentSchemas.js`. Fields marked `required` are enforced when saving.
4. If the saved data needs reshaping, add a normalizer in `src/utils/normalizeProps.js`.

The live renderer, server rendering, the admin preview and the "Add component" list all
pick it up automatically.

## Security and health

- Use `renderSafeHTML` / `smartRender` (`src/utils/htmlSanitizer.js`) for CMS text with formatting. Never pass raw CMS strings to `dangerouslySetInnerHTML`.
- Use `safeJsonLd` for any `<script type="application/ld+json">`.
- Security headers are set in `next.config.mjs`, and rate limits in nginx (contact form, admin login).
- `GET /healthz` returns 200 when the web app and the API respond.
