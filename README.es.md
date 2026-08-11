# astro-seo-complement

Metadatos SEO tipados y reutilizables y herramientas JSON-LD para Astro. Es un paquete independiente de la comunidad, no un paquete oficial de Astro.

## Camino rápido

```sh
pnpm add astro-seo-complement
```

`astroSeo()` solo valida los valores predeterminados de la integración. No reemplaza la configuración `site` de Astro, no modifica posts ni páginas y no inyecta SEO automáticamente.

## Componente SEO explícito

Usá `entry` para el flujo actual del blog. El componente genera `BlogPosting` únicamente cuando la entrada tiene autor. Para páginas y productos, pasá metadatos explícitos; `title` es obligatorio cuando no hay `entry`. Pasá el schema correcto de forma explícita porque el tipo de Schema.org depende del contenido real, no de la URL.

### Entrada de blog y BlogPosting

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

### Página genérica con WebPage y Organization

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

### Producto con Offer y sin valoraciones ficticias

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

Los metadatos explícitos admiten `title`, `description`, `image`, `imageAlt`, `canonicalUrl`, `locale`, `author`, `authorUrl`, `date`, `modifiedDate`, `tags` y `keywords`, además de los campos sociales y de robots existentes.

## Automático vs explícito

| Automático | Manual/explícito |
|---|---|
| Normalización de URL y fechas | Schemas `Article`, `NewsArticle`, `Product`, `FAQ` y `HowTo` |
| Meta tags HTML | Breadcrumbs y `Organization` |
| URL canonical | Sitemap, `robots.txt`, RSS y hreflang |
| Directivas robots cuando se solicitan | Cualquier schema que no se pase a `SEO` |
| Serialización segura de JSON-LD al pasar `schema` | No se incluyen todos los tipos de Schema.org ni garantías de ranking |
| `BlogPosting` solo para `entry` con autor | |

El componente serializa de forma segura el JSON-LD proporcionado, pero la validación y aptitud en Google son responsabilidad del consumidor. Los datos estructurados no garantizan ranking, rastreo, indexación ni aparición en resultados enriquecidos.

## Builders y escape hatch

Se exportan `buildPerson`, `buildOrganization`, `buildWebSite`, `buildProfilePage`, `buildWebPage`, `buildBreadcrumbList`, `buildArticle`, `buildBlogPosting`, `buildNewsArticle`, `buildOffer`, `buildAggregateOffer`, `buildAggregateRating`, `buildReview`, `buildProduct`, `buildFAQPage`, `buildHowTo` y `composeGraph`. Usá `SchemaNode` y `composeGraph` como escape hatch para tipos adicionales de Schema.org. Los builders no inventan valoraciones, reseñas, precios ni URL.

## Integración de Astro y sitemap

Mantené el sitio canónico en `astro.config.mjs` y agregá la integración opcional por separado:

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

Instalá `@astrojs/sitemap` y agregalo una sola vez cuando el sitio necesite sitemap. `astroSeo()` solo valida valores predeterminados; no reemplaza `site` ni modifica posts/páginas. `robots.txt`, RSS y hreflang siguen siendo responsabilidad de la aplicación.

## Seguridad y dependencias

El workflow de CI ya ejecuta `pnpm audit --audit-level=high` junto con los comandos de tests, comprobación de tipos y build. GitHub también ofrece análisis de CodeQL, propuestas de actualización de Dependabot y Dependency Review para pull requests mediante los workflows del repositorio.

El escaneo de secretos y la protección contra push deben activarse manualmente en **Settings** del repositorio. La disponibilidad puede depender del plan de GitHub y algunas configuraciones requieren GitHub Advanced Security. Estas funciones no se consideran activadas hasta que el repositorio remoto confirme su estado.

## Desarrollo

```sh
pnpm test
pnpm check
pnpm build
pnpm exec astro build
npm pack --dry-run --json
```

Validá los datos estructurados con Google's Rich Results Test y Schema Markup Validator. Consultá la documentación vigente de Google porque las reglas de aptitud cambian.

## Licencia

MIT. Consultá [LICENSE](./LICENSE).
