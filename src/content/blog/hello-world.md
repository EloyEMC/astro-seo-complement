---
title: "Hello World: A Practical Astro SEO Demo"
description: "A guided tour of the demo's metadata, content, and BlogPosting JSON-LD, with practical checks you can reuse in an Astro project."
date: 2024-03-21
modifiedDate: 2025-02-24
image: "/og-default.svg"
image_alt: "The astro-seo-complement demo homepage"
tags: ["welcome", "astro", "seo"]
twitter_img: "/og-default.svg"
canonicalUrl: "/blog/hello-world/"
author: "astro-seo-complement maintainers"
authorUrl: "https://github.com/Gentleman-Programming/astro-seo-complement"
ogType: "article"
siteName: "astro-seo-complement Demo"
noindex: false
nofollow: false
keywords:
  - Astro
  - SEO
  - JSON-LD
  - content design
---

# Hello World

Welcome to the **astro-seo-complement** editorial demo. This is a working content entry rather than a placeholder: its frontmatter supplies the page metadata, while the article body explains what a reader can inspect in the generated document.

## Start with a useful page

SEO begins with a page that answers a real question. This article introduces the demo and gives you a short path through its examples: read the content, inspect the page source, and compare the visible claims with the metadata and JSON-LD in the document head.

A title should tell readers what they will get. A description should set expectations. Headings should make the page easy to scan. Those same facts then become inputs to the reusable `SEO.astro` component.

## What the component contributes

The component turns one set of page facts into:

- a title, description, canonical URL, and article timestamps;
- Open Graph and Twitter card metadata for sharing; and
- a `BlogPosting` graph with the post, author, publisher, image, and keywords.

The page still owns its editorial voice. The component handles the repetitive document wiring so each route can remain explicit and inspectable.

## A practical inspection loop

1. Read the rendered page as a person would.
2. Open the generated source and find the canonical URL and JSON-LD script.
3. Check that the headline, description, author, dates, and keywords describe the same page.
4. Repeat the check whenever content or routing changes.

This loop catches a common class of SEO bugs: metadata that describes an older title, a different URL, or a page that no longer exists.

## Continue through the examples

The [blog index](/blog/) collects this article with two companion notes. The [About page](/about/) explains the project, while the [How-to guide](/how-to/) turns the inspection loop into a reusable sequence.
