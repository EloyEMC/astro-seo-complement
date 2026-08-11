import { defineConfig } from "astro/config";
import { siteConfig } from "./src/config";
import { astroSeo } from "./src/integration";

export default defineConfig({
	site: siteConfig.site,
	integrations: [
		astroSeo({ siteUrl: siteConfig.site, siteName: siteConfig.title }),
	],
});
