# astro-seo-complement

[![CI](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/ci.yml/badge.svg)](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/ci.yml)
[![CodeQL](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/codeql.yml/badge.svg)](https://github.com/EloyEMC/astro-seo-complement/actions/workflows/codeql.yml)
[![npm](https://img.shields.io/npm/v/astro-seo-complement)](https://www.npmjs.com/package/astro-seo-complement)
[![Licencia](https://img.shields.io/github/license/EloyEMC/astro-seo-complement)](./LICENSE)

Metadatos SEO explícitos y tipados, más builders de Schema.org y JSON-LD para Astro. Construí metadatos a partir de hechos reales del contenido, componé grafos relacionados y serializá JSON-LD de forma segura, sin inyección automática de SEO ni afirmaciones inventadas.

Es un paquete independiente de la comunidad, no un paquete oficial de Astro.

## ¿Por qué usarlo?

- **Metadatos explícitos:** títulos, descripciones, URLs canónicas, tarjetas sociales, directivas robots, autores y fechas salen de los valores que pasás.
- **Builders tipados de Schema.org:** creá nodos comunes como `Article`, `Product`, `FAQPage`, `HowTo`, `ImageObject` y `VideoObject` con soporte de TypeScript.
- **Grafos componibles:** conectá nodos relacionados con `composeGraph` en lugar de mantener blobs JSON-LD desconectados.
- **Serialización segura:** el schema proporcionado se serializa de forma segura en JSON-LD, incluidos caracteres que podrían romper un script inline.
- **Soporte de medios y autores:** modelá explícitamente los datos de imágenes y vídeos, y renderizá un cuadro de autor accesible para entradas de blog con datos de autor.

## Para quién es

Equipos de Astro que quieren una capa tipada y pequeña para metadatos de página y datos estructurados, manteniendo bajo su control el contenido, las URLs canónicas, la validación y las decisiones SEO propias de la aplicación.

No ofrece garantías de posicionamiento, inyección automática de SEO, generación de sitemap/RSS/robots ni todos los tipos de Schema.org.

## Camino rápido

```sh
pnpm add astro-seo-complement
```

Usá el componente `SEO` en una página o layout. Este ejemplo crea un grafo conectado de `WebPage` + `Organization` y lo pasa explícitamente al componente:

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

Para el flujo existente del blog, pasá `entry`. `BlogPosting` se genera únicamente cuando la entrada tiene autor. Cuando no hay `entry`, `title` es obligatorio y el tipo de schema debe pasarse explícitamente, porque el contenido—no la URL—determina el tipo de Schema.org.

## Límites entre metadatos y schema

| El paquete ofrece | La aplicación sigue siendo responsable de |
|---|---|
| Normalización de URLs y fechas | La configuración `site` de Astro |
| Meta tags HTML, Open Graph y campos de Twitter | Sitemap, `robots.txt`, RSS y hreflang |
| URL canónica y directivas robots solicitadas | La exactitud del contenido y el tipo de schema de cada página |
| Serialización segura de JSON-LD cuando se proporciona `schema` | Validación, aptitud, rastreo e indexación en Google |
| `BlogPosting` para un `entry` con autor | Garantías de posicionamiento o resultados enriquecidos |

Los metadatos explícitos admiten `title`, `description`, `image`, `imageAlt`, `canonicalUrl`, `locale`, `author`, `authorUrl`, `date`, `modifiedDate`, `tags` y `keywords`, además de los campos sociales y de robots existentes.

## Builders y grafos componibles

El paquete exporta builders para:

- Personas y sitios: `buildPerson`, `buildOrganization`, `buildWebSite`, `buildProfilePage`, `buildWebPage`
- Navegación y publicación: `buildBreadcrumbList`, `buildArticle`, `buildBlogPosting`, `buildNewsArticle`
- Comercio y reseñas: `buildOffer`, `buildAggregateOffer`, `buildAggregateRating`, `buildReview`, `buildProduct`
- Medios y contenido instructivo: `buildImageObject`, `buildVideoObject`, `buildFAQPage`, `buildHowTo`
- Composición: `composeGraph`

Usá `SchemaNode` con `composeGraph` como escape hatch para tipos adicionales de Schema.org. Los builders no inventan valoraciones, reseñas, precios, URLs ni ubicaciones de medios: pasá hechos que existan en el proyecto consumidor.

## Probalo en vivo

El [demo en vivo](https://astro-seo-complement.pages.dev/) combina HTML semántico con metadatos explícitos y un grafo JSON-LD inspeccionable. Abrí una ruta y usá su **inspector/árbol JSON-LD** para comparar el contenido visible, el código fuente y las relaciones del grafo.

- [Contexto e identidad del sitio](https://astro-seo-complement.pages.dev/about/)
- [Entradas de blog y autores](https://astro-seo-complement.pages.dev/blog/)
- [`NewsArticle` editorial](https://astro-seo-complement.pages.dev/editorial/)
- [Productos y ofertas](https://astro-seo-complement.pages.dev/product/)
- [Imágenes y reseñas](https://astro-seo-complement.pages.dev/reviews/)
- [FAQPage](https://astro-seo-complement.pages.dev/faq/)
- [HowTo](https://astro-seo-complement.pages.dev/how-to/)
- [BreadcrumbList](https://astro-seo-complement.pages.dev/breadcrumbs/)
- [Estado de vídeo sin medios disponibles](https://astro-seo-complement.pages.dev/video/)

El [tutorial de integración](https://astro-seo-complement.pages.dev/how-to/) cubre `SEO.astro`, builders, `composeGraph`, alineación del contenido y validación. Los metadatos de imágenes aparecen en las rutas de [producto](https://astro-seo-complement.pages.dev/product/) y [reseñas](https://astro-seo-complement.pages.dev/reviews/). Las entradas con `author`, `authorUrl` y `authorImage` renderizan un cuadro de autor accesible y reutilizable.

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

Instalá `@astrojs/sitemap` solo cuando el sitio necesite sitemap. `astroSeo()` valida los valores predeterminados de la integración; no reemplaza `site`, no modifica posts ni páginas y no inyecta SEO automáticamente.

## Compatibilidad

- Astro: `>=5.0.0 <8.0.0`
- Matriz de CI: Astro 5, 6 y 7
- Entorno de CI: Node 22 con pnpm 10.12.1
- Motor del paquete: Node `>=18.17.0`

CI ejecuta los tests, la comprobación de tipos, el build del paquete, el build del ejemplo Astro, la auditoría y la validación del paquete. La matriz selecciona la última versión disponible de cada major compatible, por lo que no garantiza compatibilidad con todas las integraciones, adapters o configuraciones de aplicación. Validá el proyecto consumidor completo por separado.

## Límites de validación

Los tests estructurales locales verifican la forma del schema generado, los campos obligatorios, la serialización y el comportamiento de los builders compatibles. Un grafo puede ser válido según Schema.org sin ser apto para un resultado enriquecido de Google: Google aplica políticas específicas, reglas de calidad y requisitos de experiencia de primera mano.

La ruta de demo `/reviews/` usa intencionalmente nombres, puntuaciones y texto de reseña ficticios para demostrar la estructura de `Review` y `AggregateRating`. No uses datos de reseñas ficticios como evidencia para resultados enriquecidos de reseñas en Google; publicá marcado de reseñas sólo cuando represente experiencia genuina de primera mano y cumpla las políticas actuales de Google.

Para una validación externa manual, publicá una página consumidora en una URL comprobable y enviala a [Google's Rich Results Test](https://search.google.com/test/rich-results) y a [Schema Markup Validator](https://validator.schema.org/). Corregí los datos estructurados generados en el proyecto consumidor; el paquete no automatiza esas comprobaciones externas.

## Desarrollo

```sh
pnpm install
pnpm test
pnpm check
pnpm build
pnpm exec astro build
npm pack --dry-run --json
```

GitHub Actions también ejecuta `pnpm audit --audit-level=high`, CodeQL y los workflows de revisión de dependencias. El escaneo de secretos y la protección contra push deben activarse manualmente en la configuración del repositorio cuando estén disponibles según el plan de GitHub.

## Licencia

MIT. Consultá [LICENSE](./LICENSE).
