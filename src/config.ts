export interface SiteConfig {
	site: string;
	title: string;
	description: string;
	locale: string;
}

export const siteConfig: SiteConfig = {
	site: "https://eloymartinezcuesta.com",
	title: "eloymartinezcuesta.com",
	description:
		"The eloymartinezcuesta.com template, powered by astro-seo-complement for inspectable metadata and JSON-LD.",
	locale: "en_US",
};
