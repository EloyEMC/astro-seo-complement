import type { AstroIntegration } from "astro";
import { validateSeoDefaults, type SeoDefaults } from "./seo";

export type AstroSeoOptions = Partial<SeoDefaults> &
	Pick<SeoDefaults, "siteUrl">;

/** Configure defaults and validate them during Astro's config setup phase. */
export function astroSeo(options: AstroSeoOptions): AstroIntegration {
	const defaults: SeoDefaults = {
		defaultLocale: "en_US",
		...options,
	};

	return {
		name: "astro-seo-complement",
		hooks: {
			"astro:config:setup": ({ logger }) => {
				for (const warning of validateSeoDefaults(defaults)) {
					logger.warn(warning);
				}
			},
		},
	};
}

export default astroSeo;
