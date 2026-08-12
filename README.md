# astro-seo-complement

[![CI](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/ci.yml/badge.svg)](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/ci.yml)
[![CodeQL](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/codeql.yml/badge.svg)](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/codeql.yml)
[![npm](https://img.shields.io/npm/v/astro-seo-complement)](https://www.npmjs.com/package/astro-seo-complement)
[![License](https://img.shields.io/npm/l/astro-seo-complement)](./LICENSE)

Typed, explicit SEO metadata and Schema.org JSON-LD builders for Astro. Build page metadata from real content facts, compose connected graphs, and serialize JSON-LD safely—without automatic SEO injection or invented claims.

This is an independent community package, not an official Astro package.

## Why use it?

- **Explicit metadata:** titles, descriptions, canonical URLs, social cards, robots directives, authors, and dates come from values you provide.
- **Typed Schema.org builders:** create common nodes such as `Article`, `Product`, `FAQPage`, `HowTo`, `ImageObject`, and `VideoObject` with TypeScript support.
- **Composable graphs:** combine related nodes with `composeGraph` instead of maintaining disconnected JSON-LD blobs.
- **Safe serialization:** supplied schema is serialized safely into JSON-LD, including characters that could otherwise break an inline script.
- **Media and author support:** model image/video facts explicitly and render an accessible author box for blog entries that include author data.

## Who it is for

Astro teams that want a small, typed layer for page metadata and structured data while keeping content, canonical URLs, validation, and application-specific SEO decisions under their control.

It does **not** provide ranking guarantees, automatic SEO injection, sitemap/RSS/robots generation, or every Schema.org type.

## Quick start

```sh
pnpm add astro-seo-complement
```

Use the `SEO` component in a page or layout. This example creates one connected `WebPage` + `Organization` graph and passes it explicitly to the component:

```astro
---
import SEO from 'astro-seo-complement/SEO.astro';
import { buildOrganization, buildWebPage, composeGraph } from 'astro-seo-complement';

const siteUrl = 'https://example.com';
const schema = composeGraph(
  buildWebPage({
    url: '/about',
    siteUrl,
    name: 'About us',
    description: 'Meet the Example team',
  }),
  buildOrganization({
    name: 'Example Inc.',
    url: siteUrl,
    siteUrl,
  }),
);
---
<SEO
  title="About us"
  description="Meet the Example team"
  canonicalUrl="/about"
  siteUrl={siteUrl}
  schema={schema}
/>
```

For the existing blog flow, pass `entry` instead. `BlogPosting` is generated only when the entry has an author. When `entry` is absent, `title` is required and the schema type must be passed explicitly because content—not the URL—determines its Schema.org type.

## Metadata and schema boundaries

| The package provides | Your application still owns |
|---|---|
| URL and date normalization | Astro's canonical `site` setting |
| HTML meta tags, Open Graph, and Twitter fields | Sitemap, `robots.txt`, RSS, and hreflang |
| Canonical URL and requested robots directives | Content accuracy and the schema type for each page |
| Safe JSON-LD serialization when `schema` is supplied | Google validation, eligibility, crawling, and indexing |
| `BlogPosting` for an authored `entry` | Ranking or rich-result guarantees |

Supported explicit metadata includes `title`, `description`, `image`, `imageAlt`, `canonicalUrl`, `locale`, `author`, `authorUrl`, `date`, `modifiedDate`, `tags`, and `keywords`, plus the existing social and robots fields.

## Builders and composable graphs

The package exports builders for:

- People and sites: `buildPerson`, `buildOrganization`, `buildWebSite`, `buildProfilePage`, `buildWebPage`
- Navigation and publishing: `buildBreadcrumbList`, `buildArticle`, `buildBlogPosting`, `buildNewsArticle`
- Commerce and reviews: `buildOffer`, `buildAggregateOffer`, `buildAggregateRating`, `buildReview`, `buildProduct`
- Media and instructional content: `buildImageObject`, `buildVideoObject`, `buildFAQPage`, `buildHowTo`
- Composition: `composeGraph`

Use `SchemaNode` with `composeGraph` as the escape hatch for additional Schema.org types. Builders do not invent ratings, reviews, prices, URLs, or media locations; pass facts that exist in the consumer project.

## See it in action

The [live demo](https://astro-seo-complement.pages.dev/) pairs semantic HTML with explicit metadata and an inspectable JSON-LD graph. Open a route and use its **JSON-LD inspector/tree** to compare visible content, page source, and graph relationships.

- [About and site identity](https://astro-seo-complement.pages.dev/about/)
- [Blog entries and author support](https://astro-seo-complement.pages.dev/blog/)
- [Editorial `NewsArticle`](https://astro-seo-complement.pages.dev/editorial/)
- [Product and offers](https://astro-seo-complement.pages.dev/product/)
- [Images and reviews](https://astro-seo-complement.pages.dev/reviews/)
- [FAQPage](https://astro-seo-complement.pages.dev/faq/)
- [HowTo](https://astro-seo-complement.pages.dev/how-to/)
- [BreadcrumbList](https://astro-seo-complement.pages.dev/breadcrumbs/)
- [Unavailable video-media state](https://astro-seo-complement.pages.dev/video/)

The [integration tutorial](https://astro-seo-complement.pages.dev/how-to/) covers `SEO.astro`, builders, `composeGraph`, content alignment, and validation. Image metadata is demonstrated on the [product](https://astro-seo-complement.pages.dev/product/) and [reviews](https://astro-seo-complement.pages.dev/reviews/) routes. Blog entries with `author`, `authorUrl`, and `authorImage` render a reusable accessible author box.

## Astro integration and sitemap

Keep the canonical site in `astro.config.mjs` and add the optional integration separately:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { astroSeo } from 'astro-seo-complement/astro';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    astroSeo({ siteUrl: 'https://example.com' }),
    sitemap(),
  ],
});
```

Install `@astrojs/sitemap` only when the site needs a sitemap. `astroSeo()` validates integration defaults; it does not replace `site`, modify posts or pages, or inject SEO automatically.

## Compatibility

- Astro: `>=5.0.0 <8.0.0`
- CI matrix: Astro 5, 6, and 7
- CI runtime: Node 22 with pnpm 10.12.1
- Package engine: Node `>=18.17.0`

CI runs the package tests, type-check, package build, example Astro build, audit, and pack validation. The matrix selects the latest available release in each supported Astro major, so it does not guarantee compatibility with every integration, adapter, or application configuration. Validate the complete consumer project separately.

## Validation limits

Local structural tests verify generated schema shape, required fields, serialization, and supported builder behavior. They do not reproduce Google's external eligibility rules or guarantee ranking, crawling, indexing, or rich-result display.

For manual external validation, make a consumer page available at a testable URL and submit it to [Google's Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/). Correct the generated structured data in the consumer project; these external checks are not automated by this package.

## Development

```sh
pnpm install
pnpm test
pnpm check
pnpm build
pnpm exec astro build
npm pack --dry-run --json
```

GitHub Actions also runs `pnpm audit --audit-level=high`, CodeQL, and dependency review workflows. Secret scanning and push protection must be enabled manually in the repository settings when available for the repository's GitHub plan.

## License

MIT. See [LICENSE](./LICENSE).
