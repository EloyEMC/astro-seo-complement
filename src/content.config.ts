import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const urlString = () =>
	z.string().refine((value) => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}, "Expected a valid URL");

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.coerce.date(),
		modifiedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),
		image: z.string().optional(),
		image_alt: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		twitter_img: z.string().optional(),
		twitterCreator: z.string().optional(),
		twitterSite: z.string().optional(),
		canonicalUrl: z.string().optional(),
		author: z.string().optional(),
		authorUrl: urlString().optional(),
		authorImage: z.string().optional(),
		ogType: z.enum(["website", "article"]).default("article"),
		locale: z.string().optional(),
		siteName: z.string().optional(),
		noindex: z.boolean().default(false),
		nofollow: z.boolean().default(false),
	}),
});

const product = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
	schema: z.object({
		name: z.string(),
		description: z.string().optional(),
		image: z.array(z.string()).min(1).optional(),
		sku: z.string().optional(),
		price: z.number().nonnegative().optional(),
		priceCurrency: z.string().length(3).optional(),
		availability: urlString().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, product };
