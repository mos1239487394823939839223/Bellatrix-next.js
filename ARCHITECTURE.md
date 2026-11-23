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
| `src/components/site` | **Reusable section kit**: `Section`, `SectionHeader`, `CardGrid`, `FeatureCard`, `Accordion`, `CtaBanner` | Build new sections from these |
| `src/components` | UI: site sections (About/, solution/, industries/, Services/, Support/…), admin-form UI (`UI/`), admin screens (`Admin/`) | Presentational; data comes from props or services |
| `src/views` | Screen-level components used by `app/` routes (admin screens, auth screens) | |
| `src/contexts` | React contexts and providers (theme, CTA modal, admin, data) | |
| `src/hooks` | Reusable hooks (`useAuth`, `useBackgroundVideo`…) | |
| `src/config` | Configuration (API base URLs, settings field map, toast) | |
| `src/lib` | Server-side SEO helpers (`seo.js`, `pageMeta.js`) | |
| `src/utils` | Pure helpers (sanitizer, normalizeProps, cache busting…) | No React, no HTTP |
| `src/store` | Redux slices used by older screens | |
| `src/styles` | Theme and animation CSS | |

## Building a section with the kit

```jsx
import { Section, SectionHeader, CardGrid, FeatureCard, Accordion, CtaBanner } from "../../site";

<Section tone="navy" glow>                                  {/* light | muted | navy */}
  <SectionHeader title={title} description={intro} tone="dark" />
  <CardGrid columns={{ sm: 2, lg: 3 }}>                     {/* equal-height rows */}
    {items.map((i) => <FeatureCard key={i.title} variant="glass" title={i.title} description={i.text} />)}
  </CardGrid>
</Section>

<Accordion items={faqs} variant="card" />                   {/* accessible FAQ, card | line */}
<CtaBanner title="Ready?" description="…" buttonText="Talk to an expert" />
```

- `Section` sets the background, spacing and container, and the `data-theme` the navbar uses to pick light or dark text.
- `SectionHeader` renders simple CMS formatting in titles safely.
- Every piece accepts `className` / `titleClassName`-style overrides for one-off styling.

Sections already built on the kit: HR Modules (also used on Payroll), HR Use Cases, HR Why Choose, HR FAQ, HR CTA, and the Payroll FAQ.

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
