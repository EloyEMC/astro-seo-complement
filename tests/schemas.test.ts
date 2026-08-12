import { describe, expect, it } from "vitest";
import {
	buildArticle,
	buildAggregateOffer,
	buildAggregateRating,
	buildBlogPosting,
	buildBreadcrumbList,
	buildFAQPage,
	buildHowTo,
	buildImageObject,
	buildVideoObject,
	buildNewsArticle,
	buildOffer,
	buildOrganization,
	buildPerson,
	buildProduct,
	buildProfilePage,
	buildReview,
	buildWebPage,
	buildWebSite,
	composeGraph,
} from "../src/schemas";

describe("JSON-LD builders", () => {
	it("builds an ImageObject with resolved URLs and factual dimensions", () => {
		const image = buildImageObject({
			name: "Field guide cover",
			contentUrl: "/assets/field-guide.svg",
			caption: "Illustrative SEO Field Guide cover",
			width: 1200,
			height: 800,
			siteUrl: "https://example.com",
		});

		expect(image).toMatchObject({
			"@type": "ImageObject",
			name: "Field guide cover",
			contentUrl: "https://example.com/assets/field-guide.svg",
			caption: "Illustrative SEO Field Guide cover",
			width: 1200,
			height: 800,
		});
	});

	it("builds a VideoObject without inventing unavailable media URLs", () => {
		const video = buildVideoObject({
			name: "SEO graph walkthrough",
			description: "A documented video placeholder for the demo.",
			thumbnailUrl: "/assets/video-poster.svg",
			uploadDate: "2025-01-01",
			siteUrl: "https://example.com",
		});

		expect(video).toMatchObject({
			"@type": "VideoObject",
			thumbnailUrl: ["https://example.com/assets/video-poster.svg"],
			uploadDate: "2025-01-01T00:00:00.000Z",
		});
		expect(video).not.toHaveProperty("contentUrl");
	});
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

	it("preserves explicit offer IDs across product and aggregate offer nodes", () => {
		const offers = [
			{ id: "/product/#offer-starter", price: 9, priceCurrency: "USD" },
			{ id: "/product/#offer-pro", price: 19, priceCurrency: "USD" },
		];
		const product = buildProduct({
			name: "Field guide",
			siteUrl: "https://example.com",
			offers,
		});
		const aggregate = buildAggregateOffer({
			lowPrice: 9,
			highPrice: 19,
			offerCount: 2,
			priceCurrency: "USD",
			siteUrl: "https://example.com",
			offers,
		});

		expect(product.offers).toMatchObject([
			{ "@id": "https://example.com/product/#offer-starter" },
			{ "@id": "https://example.com/product/#offer-pro" },
		]);
		expect(aggregate.offers).toMatchObject([
			{ "@id": "https://example.com/product/#offer-starter" },
			{ "@id": "https://example.com/product/#offer-pro" },
		]);
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

	it.each([
		[
			"person",
			buildPerson({ name: "Ada", siteUrl: "https://example.com", url: "/ada" }),
		],
		[
			"organization",
			buildOrganization({
				name: "Example",
				siteUrl: "https://example.com",
				url: "/org",
			}),
		],
		[
			"website",
			buildWebSite({
				name: "Example",
				url: "/",
				siteUrl: "https://example.com",
				publisher: { name: "Example" },
			}),
		],
		[
			"profile page",
			buildProfilePage({
				name: "Ada's profile",
				url: "/authors/ada",
				siteUrl: "https://example.com",
				mainEntity: { name: "Ada" },
			}),
		],
		[
			"web page",
			buildWebPage({
				name: "About",
				url: "/about",
				siteUrl: "https://example.com",
			}),
		],
		[
			"blog posting",
			buildBlogPosting({
				headline: "A post",
				author: { name: "Ada" },
				siteUrl: "https://example.com",
			}),
		],
		[
			"news article",
			buildNewsArticle({
				headline: "Breaking news",
				author: "Ada",
				siteUrl: "https://example.com",
			}),
		],
		[
			"offer",
			buildOffer({
				price: 10,
				priceCurrency: "USD",
				siteUrl: "https://example.com",
			}),
		],
		[
			"aggregate offer",
			buildAggregateOffer({
				lowPrice: 10,
				highPrice: 20,
				offerCount: 2,
				priceCurrency: "USD",
				siteUrl: "https://example.com",
				offers: [{ price: 10, priceCurrency: "USD" }],
			}),
		],
		[
			"review",
			buildReview({ author: "Ada", reviewRating: { ratingValue: 5 } }),
		],
		["FAQ page", buildFAQPage([{ question: "What?", answer: "This." }])],
		[
			"how-to",
			buildHowTo({
				name: "Make tea",
				steps: [{ name: "Boil water", text: "Boil it." }],
			}),
		],
	] satisfies Array<
		[string, unknown]
	>)("covers every public builder with valid JSON-LD structure", (_, node) => {
		expect(node).toMatchObject({ "@context": "https://schema.org" });
		expect(node).toEqual(
			expect.objectContaining({ "@type": expect.any(String) }),
		);
		expect(JSON.stringify(node)).not.toContain("undefined");
	});

	it("preserves semantic positions and nested entities", () => {
		const breadcrumbs = buildBreadcrumbList(
			[{ name: "Home", item: "/" }, { name: "Docs" }],
			"https://example.com",
		);
		const faq = buildFAQPage([{ question: "What?", answer: "This." }]);
		const howTo = buildHowTo({
			name: "Make tea",
			steps: [
				{ name: "Boil water", text: "Boil it." },
				{ name: "Steep", text: "Wait." },
			],
		});
		const aggregate = buildAggregateOffer({
			lowPrice: 10,
			highPrice: 20,
			offerCount: 2,
			priceCurrency: "USD",
			offers: [{ price: 10, priceCurrency: "USD" }],
		});

		expect(breadcrumbs.itemListElement).toMatchObject([
			{ position: 1, item: "https://example.com/" },
			{ position: 2, name: "Docs" },
		]);
		expect(faq.mainEntity).toMatchObject([
			{ "@type": "Question", acceptedAnswer: { text: "This." } },
		]);
		expect(howTo.step).toMatchObject([
			{ position: 1, name: "Boil water" },
			{ position: 2, name: "Steep" },
		]);
		expect(aggregate.offers).toMatchObject([
			{ "@type": "Offer", price: 10, priceCurrency: "USD" },
		]);
	});
});
