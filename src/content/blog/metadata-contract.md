---
title: "The Metadata Contract: One Source of Truth for an Astro Page"
description: "A practical way to keep visible copy, canonical metadata, and JSON-LD aligned as an Astro site grows."
date: 2025-02-10
modifiedDate: 2025-02-22
image: "/og-default.svg"
image_alt: "A diagram-like preview of an inspectable Astro page"
tags: ["metadata", "architecture", "astro"]
twitter_img: "/og-default.svg"
canonicalUrl: "/blog/metadata-contract/"
author: "Eloy Martínez Cuesta"
authorUrl: "https://eloymartinezcuesta.com"
authorImage: "https://eloymartinezcuesta.com/eloy-author.webp"
ogType: "article"
siteName: "astro-seo-complement Demo"
keywords:
  - Astro metadata
  - canonical URLs
  - JSON-LD
---

# The Metadata Contract: One Source of Truth for an Astro Page

A page becomes easier to maintain when its visible content and machine-readable description are treated as two views of the same contract. The headline, summary, URL, author, and dates should not drift as a template evolves.

## Separate presentation from facts

The page layout decides how a fact is presented. The route or content entry decides what the fact is. `SEO.astro` receives those facts and renders the document-level metadata without asking the layout to duplicate every tag.

This separation keeps a reusable layout small while making each route accountable for its own title, description, and canonical path.

## Make URLs deliberate

A canonical URL is more than a formatting detail. It tells crawlers and social previews which address represents the page. Set it from the route's public path, then use that same path in navigation and internal links.

## Review the graph like an API

JSON-LD is an interface for consumers outside your component tree. Check its node types, identifiers, relationships, and dates just as you would check a public function. The demo's inspection panel makes that contract visible without hiding the source data.

The result is not a guarantee of rankings or rich results. It is a clearer, more honest description of the page you already published.
