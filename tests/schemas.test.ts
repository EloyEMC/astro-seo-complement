import { describe, expect, it } from "vitest";
import {
	buildArticle,
	buildProduct,
	composeGraph,
	buildAggregateRating,
} from "../src/schemas";

describe("JSON-LD builders", () => {
	it("builds an article with absolute stable identifiers and no undefined values", () => {
		const article = buildArticle({
			headline: "A useful article",
			url: "/articles/useful",
			siteUrl: "https://example.com",
			author: { name: "Ada" },
		});

		expect(article).toMatchObject({
			"@type": "Article",
			"@id": "https://example.com/articles/useful#article",
			url: "https://example.com/articles/useful",
			author: { "@type": "Person", name: "Ada" },
		});
		expect(JSON.stringify(article)).not.toContain("undefined");
	});

	it("does not invent product ratings or reviews", () => {
		const product = buildProduct({
			name: "Widget",
			url: "https://example.com/widget",
			image: ["/widget-1.jpg", "/widget-2.jpg"],
			siteUrl: "https://example.com",
		});

		expect(product.image).toEqual([
			"https://example.com/widget-1.jpg",
			"https://example.com/widget-2.jpg",
		]);
		expect(product).not.toHaveProperty("aggregateRating");
		expect(product).not.toHaveProperty("review");
	});

	it("composes one graph and deduplicates entities by @id", () => {
		const organization = {
			"@type": "Organization",
			"@id": "https://example.com/#org",
			name: "Example",
		};
		const graph = composeGraph([organization, { ...organization }]);
		expect(graph).toEqual({
			"@context": "https://schema.org",
			"@graph": [organization],
		});
	});

	it("discriminates organizations explicitly when they have no logo", () => {
		const article = buildArticle({
			headline: "An article",
			author: { name: "Example Foundation", type: "Organization" },
			siteUrl: "https://example.com",
		});

		expect(article.author).toMatchObject({
			"@type": "Organization",
			name: "Example Foundation",
		});
	});

	it("resolves nested author, seller, and review URLs from the parent site URL", () => {
		const product = buildProduct({
			name: "Widget",
			siteUrl: "https://example.com",
			offers: {
				price: 10,
				priceCurrency: "USD",
				seller: { name: "Example Store", type: "Organization", url: "/store" },
			},
			review: {
				author: { name: "Ada", url: "/authors/ada" },
				reviewRating: { ratingValue: 5 },
			},
		});
		const article = buildArticle({
			headline: "An article",
			siteUrl: "https://example.com",
			author: { name: "Ada", url: "/authors/ada" },
			publisher: { name: "Example Store", type: "Organization", url: "/store" },
		});

		expect(product.offers).toMatchObject({
			seller: { url: "https://example.com/store" },
		});
		expect(product.review).toMatchObject({
			author: { url: "https://example.com/authors/ada" },
		});
		expect(article.author).toMatchObject({
			url: "https://example.com/authors/ada",
		});
		expect(article.publisher).toMatchObject({
			url: "https://example.com/store",
		});
	});

	it("only emits aggregate ratings when real values are supplied", () => {
		expect(
			buildAggregateRating({ ratingValue: 4.8, ratingCount: 12 }),
		).toMatchObject({
			"@type": "AggregateRating",
			ratingValue: 4.8,
			ratingCount: 12,
		});
	});
});
