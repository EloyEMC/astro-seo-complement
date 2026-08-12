---
title: "Hello World: A Practical Astro SEO Demo"
description: "See how an Astro blog post becomes a complete, crawlable document with metadata and BlogPosting JSON-LD."
date: 2024-03-21
image: "/og-default.svg"
image_alt: "astro-seo-complement demo preview"
tags: ["welcome", "astro", "seo"]
twitter_img: "/og-default.svg"
canonicalUrl: "/blog/hello-world/"
author: "astro-seo-complement maintainers"
authorUrl: "https://github.com/Gentleman-Programming/astro-seo-complement"
ogType: "article"
siteName: "eloymartinezcuesta.com"
noindex: false
nofollow: false
keywords:
  - Astro
  - SEO
  - JSON-LD
---

# Hello World

Welcome to the **astro-seo-complement** demo. This post is intentionally small, but it is a real page rather than a placeholder: its frontmatter drives the document metadata and the structured data in the HTML head.

## What this example shows

The reusable `SEO` component turns the post into a shareable, crawlable page with:

- a title, description, canonical URL, and article timestamps;
- Open Graph and Twitter card metadata; and
- a `BlogPosting` JSON-LD object with the post, author, publisher, image, and keywords.

Open the page source or inspect the `<head>` in your browser to see the generated output. The visible article body and the machine-readable metadata describe the same content, which keeps the demo useful for both people and search engines.

[Back to the demo home page](/)
