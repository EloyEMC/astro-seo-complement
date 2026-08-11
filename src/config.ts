export interface SiteConfig {
	site: string;
	title: string;
	description: string;
	locale: string;
}

export const siteConfig: SiteConfig = {
	site: "https://yoursite.com",
	title: "Your Site",
	description: "A site powered by Astro.",
	locale: "en_US",
};
