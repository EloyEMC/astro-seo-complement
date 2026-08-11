import { describe, expect, it } from "vitest";
import {
	absoluteUrl,
	resolveSeoMetadata,
	robotsValue,
	serializeJsonLd,
	validateSeoDefaults,
} from "../src/seo";

describe("SEO utilities", () => {
	it("resolves relative and absolute URLs safely", () => {
		expect(absoluteUrl("/images/card.png", "https://example.com")).toBe(
			"https://example.com/images/card.png",
		);
		expect(
			absoluteUrl("https://cdn.example.com/card.png", "https://example.com"),
		).toBe("https://cdn.example.com/card.png");
	});

	it("builds robots directives only when requested", () => {
		expect(robotsValue()).toBeUndefined();
		expect(robotsValue(true, false)).toBe("noindex");
		expect(robotsValue(true, true)).toBe("noindex, nofollow");
	});

	it("serializes JSON-LD without executable HTML delimiters", () => {
		const serialized = serializeJsonLd({
			name: '</script><script>alert("xss")</script>',
		});

		expect(serialized).not.toContain("</script>");
		expect(serialized).toContain("\\u003C/script\\u003E");
	});

	it("normalizes explicit page metadata", () => {
		const metadata = resolveSeoMetadata(
			{
				title: "About us",
				description: "Learn about our team",
				image: "/about.png",
				canonicalUrl: "/about",
				date: "2025-01-01",
			},
			"https://example.com",
			"/about",
		);

		expect(metadata).toMatchObject({
			title: "About us",
			description: "Learn about our team",
			canonical: "https://example.com/about",
			imageUrl: "https://example.com/about.png",
			publishedDate: "2025-01-01T00:00:00.000Z",
		});
	});

	it("reports invalid integration defaults", () => {
		expect(validateSeoDefaults({ siteUrl: "not-a-url" })).toHaveLength(1);
		expect(
			validateSeoDefaults({
				siteUrl: "https://example.com",
				defaultImage: "/card.png",
			}),
		).toEqual([]);
	});
});
