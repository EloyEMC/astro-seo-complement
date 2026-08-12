export interface SiteConfig {
	site: string;
	title: string;
	description: string;
	locale: string;
}

export const siteConfig: SiteConfig = {
	site: "https://astro-seo-complement.pages.dev",
	title: "astro-seo-complement Demo",
	description:
		"A public demo of metadata and JSON-LD generated with astro-seo-complement.",
	locale: "en_US",
};
