# SEO Component for Astro

This repository contains a reusable **SEO component** for Astro projects. It is designed to handle all essential SEO tags, Open Graph, Twitter Cards, and Schema.org (JSON-LD) markup for blog posts. The component is highly customizable and integrates seamlessly with Astro's content collections.

---

## Features

- **Dynamic SEO Tags**:
  - Automatically generates meta tags for title, description, keywords, and more.
  - Supports Open Graph (Facebook) and Twitter Cards for social media sharing.

- **Schema.org (JSON-LD)**:
  - Generates structured data for blog posts, improving search engine visibility.

- **Canonical URLs**:
  - Ensures proper canonical URLs to avoid duplicate content issues.

- **Robots Meta Tags**:
  - Supports `noindex` and `nofollow` directives for controlling search engine indexing.

- **Dynamic Image URLs**:
  - Automatically constructs full image URLs using the site's base URL.

- **Customizable**:
  - Easily extendable to support additional SEO features or custom requirements.

---

## Installation

1. Clone this repository or copy the `SEO.astro` component into your Astro project.

2. Import and use the SEO component in your Astro pages or layouts.
   
3. Folder structure:
   ```plaintext
  
    ├── src/
    │   ├── components/
    │   │   └── SEO.astro                # Main component of SEO
    │   ├── content/
    │   │   └── blog/
    │   │       └── *.md                 # Markdown files for blog posts
    │   ├── layouts/
    │   │   ├── BlogPost.astro           # Layout for blog pages
    │   │   └── PostBaseLayout.astro     # Basic layout for blog pages
    │   ├── pages/
    │   │   ├── blog/
    │   │   │   ├── [...page].astro      # Page to list blog posts
    │   │   │   └── [slug].astro         # Dynamic page for each blog post
    │   │   └── index.astro              # Home page
    │   ├── config.ts                    # Site settings (siteUrl, title, etc.)
    │   └── utils/
    │       └── posts.ts                 # Utilidades para manejar entradas del blog
    ├── public/
    │   ├── images/                      # Utilities for managing blog entries
    │   │   ├── logo.png
    │   │   ├── favicon.png
    │   │   └── default-image.png
    │   └── sitemap-index.xml            # Sitemap of the site
    ├── astro.config.mjs                 # Configuración de Astro
    ├── package.json                     # Astro Settings
    ├── README.md                        # Project documentation
    └── LICENSE                          # Project License (MIT)
---

##Usage

1. Add the SEO Component to Your Layout
In your layout file (e.g., src/layouts/BlogPost.astro), import and use the SEO component:
``` astro
---
import SEO from "../components/SEO.astro";
import { siteConfig } from "../config";

const { post, siteUrl, defaultImage } = Astro.props;
---

<SEO
  entry={post}
  siteUrl={siteUrl}
  defaultImage={defaultImage}
/>
```
2. Pass SEO Data from Your Pages
In your page file (e.g., src/pages/blog/[slug].astro), pass the necessary data to the layout:
``` astro
---
import BlogPost from "../../layouts/BlogPost.astro";
import { getCollection } from 'astro:content';
import { siteConfig } from "../../config";

const siteUrl = siteConfig.site; // Base URL of your site
const defaultImage = `${siteUrl}/default-image.png`; // Default image for SEO

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post, siteUrl, defaultImage },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost post={post} siteUrl={siteUrl} defaultImage={defaultImage}>
  <Content />
</BlogPost>
```
3. Define SEO Data in Your Markdown Files
In your Markdown files (e.g., src/content/blog/*.md), define the SEO data in the frontmatter:
```markdown
---
title: "Hello World"
description: "Welcome to my blog! This is my first post."
date: 2024-03-21
image: "/images/hello-world.webp"
image_alt: "Hello World Image"
tags: ["welcome", "first-post"]
twitter_img: "/images/twitter-hello-world.webp"
twitterCreator: "@your_twitter_handle"
twitterSite: "@your_twitter_handle"
canonicalUrl: "{Astro.url.href}"
author: "Your Name"
authorUrl: "https://yourwebsite.com"
authorImage: "/images/author.webp"
ogType: "article"
siteName: "Your Site Name"
noindex: false
nofollow: false
keywords:
  - blog
  - seo
  - astro
---
```
---
## Configuration
1. Site Configuration
Define your site's base URL and other settings in a configuration file (e.g., src/config.ts):
```typscript
export interface SiteConfig {
  site: string;
  title: string;
  description: string;
  // Add other fields as needed
}

export const siteConfig: SiteConfig = {
  site: "https://yourwebsite.com", // Your site's base URL
  title: "Your Site Name",
  description: "Welcome to my blog!",
};
```
2. SEO Component Props
The SEO component accepts the following props:

| Prop            | Tipo                         | Descripción                                                                 |
|-----------------|------------------------------|-----------------------------------------------------------------------------|
| `entry`         | `CollectionEntry<'blog'>`    | La entrada del blog desde las colecciones de contenido de Astro.            |
| `siteUrl`       | `string`                     | La URL base de tu sitio.                                                    |
| `defaultImage`  | `string`                     | La URL de la imagen predeterminada para SEO (usada si no se proporciona una imagen en la publicación). |
| `defaultLocale` | `string` (opcional)          | La configuración regional predeterminada para las etiquetas Open Graph (por defecto: "es_ES"). |

---
## Example Output
The SEO component generates the following HTML:
```html

   <!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello World</title>
    <meta name="description" content="Welcome to my blog! This is my first post.">
    <meta name="keywords" content="blog, seo, astro">
    <meta property="og:type" content="article">
    <meta property="og:title" content="Hello World">
    <meta property="og:description" content="Welcome to my blog! This is my first post.">
    <meta property="og:image" content="https://yourwebsite.com/images/hello-world.webp">
    <meta property="og:site_name" content="Your Site Name">
    <meta property="og:locale" content="es_ES">
    <meta property="og:url" content="https://yourwebsite.com/blog/hello-world">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@your_twitter_handle">
    <meta name="twitter:creator" content="@your_twitter_handle">
    <meta name="twitter:title" content="Hello World">
    <meta name="twitter:description" content="Welcome to my blog! This is my first post.">
    <meta name="twitter:image" content="https://yourwebsite.com/images/twitter-hello-world.webp">
    <link rel="canonical" href="https://yourwebsite.com/blog/hello-world">
    <meta name="author" content="Your Name">
    <link rel="author" href="https://yourwebsite.com">
    <meta name="author-image" content="https://yourwebsite.com/images/author.webp">
    <meta property="article:published_time" content="2024-03-21T00:00:00.000Z">
    <meta property="article:tag" content="welcome">
    <meta property="article:tag" content="first-post">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Hello World",
        "description": "Welcome to my blog! This is my first post.",
        "url": "https://yourwebsite.com/blog/hello-world",
        "datePublished": "2024-03-21T00:00:00.000Z",
        "dateModified": "2024-03-21T00:00:00.000Z",
        "author": {
          "@type": "Person",
          "name": "Your Name",
          "url": "https://yourwebsite.com",
          "image": "https://yourwebsite.com/images/author.webp"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Your Site Name",
          "logo": {
            "@type": "ImageObject",
            "url": "https://yourwebsite.com/logo.png"
          }
        },
        "image": "https://yourwebsite.com/images/hello-world.webp",
        "keywords": "blog, seo, astro",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://yourwebsite.com/blog/hello-world"
        }
      }
    </script>
    <link rel="icon" type="image/png" href="https://yourwebsite.com/favicon.png">
    <meta name="theme-color" content="#ffffff">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <!-- Your content here -->
  </body>
</html>
```
---
## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

---
License

This project is licensed under the MIT License. See the LICENSE file for details.

---
## Repository Description

### SEO Component for Astro

A reusable and customizable SEO component for Astro projects. It generates meta tags, Open Graph, Twitter Cards, and Schema.org (JSON-LD) markup for blog posts. Designed to improve search engine visibility and social media sharing.


---

Feel free to customize the repository and README as needed! 😊

