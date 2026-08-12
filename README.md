# astro-seo-complement

Typed, reusable SEO metadata and JSON-LD tools for Astro. This is an independent community package, not an official Astro package.

## Quick path

```sh
pnpm add astro-seo-complement
```

`astroSeo()` only validates integration defaults. It does not replace Astro's `site` setting, modify posts or pages, or inject SEO automatically.

## Explicit SEO component

Use `entry` for the existing blog flow. The component generates a `BlogPosting` only when the blog entry has an author. For pages and products, pass explicit metadata; `title` is required when `entry` is absent. Pass the correct schema explicitly because the content—not the URL—determines its Schema.org type.

### Blog entry and BlogPosting

```astro
---
import SEO from 'astro-seo-complement/SEO.astro';
const { post } = Astro.props;
---
<SEO
  entry={post}
  siteUrl="https://example.com"
  siteName="Example"
  defaultImage="/og-default.png"
/>
```

### Generic page with WebPage and Organization

```astro
---
import SEO from 'astro-seo-complement/SEO.astro';
import { buildOrganization, buildWebPage, composeGraph } from 'astro-seo-complement';

const siteUrl = 'https://example.com';
const schema = composeGraph(
  buildWebPage({ url: '/about', siteUrl, name: 'About us', description: 'Our team' }),
  buildOrganization({ name: 'Example Inc.', url: siteUrl, siteUrl }),
);
---
<SEO title="About us" description="Our team" canonicalUrl="/about" siteUrl={siteUrl} schema={schema} />
```

### Product with an Offer and no fictional ratings

```astro
---
import SEO from 'astro-seo-complement/SEO.astro';
import { buildProduct } from 'astro-seo-complement';

const siteUrl = 'https://example.com';
const schema = buildProduct({
  name: 'Widget', url: '/products/widget', siteUrl,
  description: 'A real widget',
  offers: { price: 29.99, priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
});
---
<SEO title="Widget" description="A real widget" image="/widget.png" siteUrl={siteUrl} schema={schema} />
```

Supported explicit metadata includes `title`, `description`, `image`, `imageAlt`, `canonicalUrl`, `locale`, `author`, `authorUrl`, `date`, `modifiedDate`, `tags`, and `keywords`, plus the existing social and robots fields.

## Automatic vs explicit

| Automatic | Explicit/manual |
|---|---|
| URL and date normalization | `Article`, `NewsArticle`, `Product`, `FAQ`, and `HowTo` schemas |
| HTML meta tags | Breadcrumbs and `Organization` |
| Canonical URL | Sitemap, `robots.txt`, RSS, and hreflang |
| Robots directives when requested | Any schema not passed to `SEO` |
| Safe JSON-LD serialization when `schema` is passed | All Schema.org types and Google ranking guarantees are **not included** |
| `BlogPosting` only for `entry` with an author | |

The component safely serializes supplied JSON-LD, but Google validation and eligibility are the consumer's responsibility. Structured data does not guarantee ranking, crawling, indexing, or rich-result display.

## Builders and escape hatch

Exports include `buildPerson`, `buildOrganization`, `buildWebSite`, `buildProfilePage`, `buildWebPage`, `buildBreadcrumbList`, `buildArticle`, `buildBlogPosting`, `buildNewsArticle`, `buildOffer`, `buildAggregateOffer`, `buildAggregateRating`, `buildReview`, `buildProduct`, `buildFAQPage`, `buildHowTo`, and `composeGraph`. Use `SchemaNode` and `composeGraph` as the escape hatch for additional Schema.org types. Builders do not invent ratings, reviews, prices, or URLs.

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

Install `@astrojs/sitemap` and add it once when the site needs a sitemap. `astroSeo()` validates defaults only; it does not replace `site` or modify posts/pages. `robots.txt`, RSS, and hreflang remain application concerns.

## Astro compatibility

The package declares support for Astro `>=5.0.0 <8.0.0`. CI checks the package against Astro 5, 6, and 7 on Node 22 with pnpm 10.12.1. Each run selects the latest available release in that major version, so the matrix provides ongoing coverage as Astro patch releases change.

This matrix verifies the package's tests, type-check, package build, and example Astro build. It does not guarantee compatibility with every Astro integration, adapter, or application-specific configuration. Keep Astro within the declared peer-dependency range and validate the complete consumer project separately.

## Security and dependency checks

The CI workflow already runs `pnpm audit --audit-level=high` alongside the test, type-check, and build commands. GitHub also provides CodeQL analysis, Dependabot update proposals, and Dependency Review for pull requests through the repository workflows.

Secret scanning and push protection must be enabled manually in the repository's **Settings**. Availability can depend on the repository's GitHub plan, and some configurations require GitHub Advanced Security. These features are not considered enabled until the remote repository confirms their status.

## Development

```sh
pnpm test
pnpm check
pnpm build
pnpm exec astro build
npm pack --dry-run --json
```

Validate generated structured data with Google's Rich Results Test and Schema Markup Validator. Consult current Google documentation because eligibility rules change.

## License

MIT. See [LICENSE](./LICENSE).
