export interface SeoDefaults {
	siteUrl: string;
	defaultImage?: string;
	defaultLocale?: string;
	siteName?: string;
}

export interface SeoMetadata {
	title: string;
	description?: string;
	image?: string;
	imageAlt?: string;
	canonicalUrl?: string;
	locale?: string;
	author?: string;
	authorUrl?: string;
	authorImage?: string;
	date?: Date | string;
	modifiedDate?: Date | string;
	tags?: string[];
	keywords?: string[];
	twitterImage?: string;
	twitterCreator?: string;
	twitterSite?: string;
	ogType?: string;
	noindex?: boolean;
	nofollow?: boolean;
}

export interface ResolvedSeoMetadata extends SeoMetadata {
	canonical: string;
	imageUrl: string;
	twitterImageUrl: string;
	publishedDate?: string;
	modified?: string;
}

export function resolveSeoMetadata(
	metadata: SeoMetadata,
	siteUrl: string,
	pathname = "/",
	defaultImage = "/og-default.png",
): ResolvedSeoMetadata {
	const canonical = metadata.canonicalUrl
		? absoluteUrl(metadata.canonicalUrl, siteUrl)
		: new URL(pathname, siteUrl).href;
	const imageUrl = absoluteUrl(metadata.image ?? defaultImage, siteUrl);
	const twitterImageUrl = absoluteUrl(
		metadata.twitterImage ?? metadata.image ?? defaultImage,
		siteUrl,
	);
	const publishedDate = metadata.date ? isoDate(metadata.date) : undefined;
	const modified = metadata.modifiedDate
		? isoDate(metadata.modifiedDate)
		: publishedDate;
	return {
		...metadata,
		canonical,
		imageUrl,
		twitterImageUrl,
		publishedDate,
		modified,
	};
}

/** Serialize JSON-LD so untrusted strings cannot terminate the containing script element. */
export function serializeJsonLd(value: unknown): string {
	return (JSON.stringify(value) ?? "null")
		.replace(/</g, "\\u003C")
		.replace(/>/g, "\\u003E")
		.replace(/&/g, "\\u0026")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");
}

export function absoluteUrl(value: string | URL, siteUrl: string): string {
	return new URL(value.toString(), siteUrl).href;
}

export function isoDate(value: Date | string): string {
	return new Date(value).toISOString();
}

export function robotsValue(
	noindex?: boolean,
	nofollow?: boolean,
): string | undefined {
	const directives = [noindex && "noindex", nofollow && "nofollow"].filter(
		Boolean,
	);
	return directives.length ? directives.join(", ") : undefined;
}

export function validateSeoDefaults(defaults: SeoDefaults): string[] {
	const warnings: string[] = [];
	try {
		new URL(defaults.siteUrl);
	} catch {
		warnings.push(`siteUrl must be an absolute URL: ${defaults.siteUrl}`);
	}
	if (defaults.defaultImage) {
		try {
			absoluteUrl(defaults.defaultImage, defaults.siteUrl);
		} catch {
			warnings.push(
				`defaultImage must be a valid URL or root-relative path: ${defaults.defaultImage}`,
			);
		}
	}
	return warnings;
}
