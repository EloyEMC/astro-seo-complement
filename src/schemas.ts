import { absoluteUrl } from "./seo";

export type SchemaValue =
	| string
	| number
	| boolean
	| SchemaNode
	| SchemaValue[];
export interface SchemaNode {
	"@context"?: "https://schema.org";
	"@type": string | string[];
	"@id"?: string;
	[key: string]: SchemaValue | undefined;
}
export type SchemaInput = SchemaNode | SchemaNode[];
export interface SchemaGraph {
	"@context": "https://schema.org";
	"@graph": SchemaNode[];
}
export type ImageValue = string | URL | Array<string | URL>;
export type AuthorInput = string | URL | PersonInput | OrganizationInput;
export interface BaseInput {
	siteUrl?: string | URL;
	id?: string | URL;
	url?: string | URL;
	type?: "Person" | "Organization";
}
export interface PersonInput extends BaseInput {
	name: string;
	sameAs?: Array<string | URL>;
	image?: ImageValue;
	jobTitle?: string;
}
export interface OrganizationInput extends BaseInput {
	name: string;
	url?: string | URL;
	logo?: ImageValue;
	sameAs?: Array<string | URL>;
}
export interface ArticleInput extends BaseInput {
	headline: string;
	description?: string;
	image?: ImageValue;
	datePublished?: Date | string;
	dateModified?: Date | string;
	author: AuthorInput | AuthorInput[];
	publisher?: OrganizationInput;
	keywords?: string[];
	articleSection?: string;
	inLanguage?: string;
}
export interface ProductInput extends BaseInput {
	name: string;
	description?: string;
	image?: ImageValue;
	brand?: string | OrganizationInput;
	sku?: string;
	offers?: OfferInput | OfferInput[];
	aggregateRating?: AggregateRatingInput;
	review?: ReviewInput | ReviewInput[];
}
export interface OfferInput extends BaseInput {
	price: number | string;
	priceCurrency: string;
	availability?: string | URL;
	validFrom?: Date | string;
	seller?: OrganizationInput;
}
export interface AggregateOfferInput extends BaseInput {
	lowPrice: number | string;
	highPrice: number | string;
	offerCount: number;
	priceCurrency: string;
	offers?: OfferInput[];
}
export interface ReviewInput extends BaseInput {
	author: AuthorInput;
	reviewRating?: {
		ratingValue: number | string;
		bestRating?: number | string;
		worstRating?: number | string;
	};
	reviewBody?: string;
	datePublished?: Date | string;
}
export interface ImageObjectInput extends BaseInput {
	name: string;
	contentUrl: string | URL;
	caption?: string;
	width?: number;
	height?: number;
}
export interface VideoObjectInput extends BaseInput {
	name: string;
	description: string;
	thumbnailUrl: ImageValue;
	uploadDate: Date | string;
	contentUrl?: string | URL;
	embedUrl?: string | URL;
	duration?: string;
}
export interface AggregateRatingInput {
	ratingValue: number | string;
	ratingCount?: number;
	reviewCount?: number;
	bestRating?: number | string;
	worstRating?: number | string;
}

const context = "https://schema.org" as const;
const clean = (value: unknown): any => {
	if (Array.isArray(value))
		return value.map(clean).filter((item) => item !== undefined);
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, v]) => v !== undefined)
				.map(([k, v]) => [k, clean(v)]),
		);
	return value;
};
const date = (value?: Date | string) =>
	value === undefined ? undefined : new Date(value).toISOString();
const url = (value: string | URL | undefined, siteUrl?: string | URL) =>
	value === undefined
		? undefined
		: siteUrl
			? absoluteUrl(value, siteUrl.toString())
			: value.toString();
const id = (type: string, input: BaseInput, suffix = type.toLowerCase()) => {
	const resolved = url(input.id ?? input.url, input.siteUrl);
	return resolved ? `${resolved}#${suffix}` : undefined;
};
const image = (value?: ImageValue, siteUrl?: string | URL) =>
	value === undefined
		? undefined
		: (Array.isArray(value) ? value : [value]).map((item) =>
				url(item, siteUrl),
			);

export function buildPerson(input: PersonInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "Person",
		"@id": id("Person", input),
		name: input.name,
		url: url(input.url, input.siteUrl),
		image: image(input.image, input.siteUrl),
		sameAs: input.sameAs?.map((item) => url(item, input.siteUrl)),
		jobTitle: input.jobTitle,
	});
}
export function buildOrganization(input: OrganizationInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "Organization",
		"@id": id("Organization", input, "organization"),
		name: input.name,
		url: url(input.url ?? input.id, input.siteUrl),
		logo: image(input.logo, input.siteUrl),
		sameAs: input.sameAs?.map((item) => url(item, input.siteUrl)),
	});
}
export function buildWebSite(input: {
	name: string;
	url: string | URL;
	siteUrl?: string | URL;
	description?: string;
	publisher?: OrganizationInput;
}): SchemaNode {
	return clean({
		"@context": context,
		"@type": "WebSite",
		"@id": `${url(input.url, input.siteUrl)}#website`,
		name: input.name,
		url: url(input.url, input.siteUrl),
		description: input.description,
		publisher: input.publisher && buildOrganization(input.publisher),
	});
}
export function buildProfilePage(input: {
	url: string | URL;
	siteUrl?: string | URL;
	name: string;
	mainEntity: PersonInput;
}): SchemaNode {
	return clean({
		"@context": context,
		"@type": "ProfilePage",
		"@id": `${url(input.url, input.siteUrl)}#profilepage`,
		url: url(input.url, input.siteUrl),
		name: input.name,
		mainEntity: buildPerson(input.mainEntity),
	});
}
export function buildWebPage(input: {
	url: string | URL;
	siteUrl?: string | URL;
	name: string;
	description?: string;
	isPartOf?: SchemaNode;
}): SchemaNode {
	return clean({
		"@context": context,
		"@type": "WebPage",
		"@id": `${url(input.url, input.siteUrl)}#webpage`,
		url: url(input.url, input.siteUrl),
		name: input.name,
		description: input.description,
		isPartOf: input.isPartOf,
	});
}
export function buildBreadcrumbList(
	items: Array<{ name: string; item?: string | URL }>,
	siteUrl?: string | URL,
): SchemaNode {
	return clean({
		"@context": context,
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: url(item.item, siteUrl),
		})),
	});
}
const author = (value: AuthorInput, siteUrl?: string | URL) => {
	if (typeof value === "string" || value instanceof URL)
		return { "@type": "Person", name: value.toString() };
	const isOrganization =
		value.type === "Organization" ||
		(value.type === undefined && "logo" in value && value.logo !== undefined);
	return isOrganization
		? buildOrganization({ ...value, siteUrl })
		: buildPerson({ ...value, siteUrl });
};
export function buildArticle(
	input: ArticleInput,
	type: "Article" | "BlogPosting" | "NewsArticle" = "Article",
): SchemaNode {
	const canonical = url(input.url, input.siteUrl);
	return clean({
		"@context": context,
		"@type": type,
		"@id": id(type, input, "article"),
		headline: input.headline,
		description: input.description,
		url: canonical,
		image: image(input.image, input.siteUrl),
		datePublished: date(input.datePublished),
		dateModified: date(input.dateModified),
		author: Array.isArray(input.author)
			? input.author.map((item) => author(item, input.siteUrl))
			: author(input.author, input.siteUrl),
		publisher:
			input.publisher &&
			buildOrganization({
				...input.publisher,
				siteUrl: input.siteUrl ?? input.publisher.siteUrl,
			}),
		keywords: input.keywords?.join(", "),
		articleSection: input.articleSection,
		inLanguage: input.inLanguage,
		mainEntityOfPage: canonical && { "@id": `${canonical}#webpage` },
	});
}
export const buildBlogPosting = (input: ArticleInput) =>
	buildArticle(input, "BlogPosting");
export const buildNewsArticle = (input: ArticleInput) =>
	buildArticle(input, "NewsArticle");
export function buildOffer(input: OfferInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "Offer",
		"@id": id("Offer", input),
		url: url(input.url, input.siteUrl),
		price: input.price,
		priceCurrency: input.priceCurrency,
		availability: input.availability?.toString(),
		validFrom: date(input.validFrom),
		seller:
			input.seller &&
			buildOrganization({
				...input.seller,
				siteUrl: input.siteUrl ?? input.seller.siteUrl,
			}),
	});
}
export function buildAggregateOffer(input: AggregateOfferInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "AggregateOffer",
		"@id": id("AggregateOffer", input),
		lowPrice: input.lowPrice,
		highPrice: input.highPrice,
		offerCount: input.offerCount,
		priceCurrency: input.priceCurrency,
		offers: input.offers?.map((offer) =>
			buildOffer({ ...offer, siteUrl: input.siteUrl ?? offer.siteUrl }),
		),
	});
}
export function buildImageObject(input: ImageObjectInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "ImageObject",
		"@id": id("ImageObject", input, "image"),
		name: input.name,
		contentUrl: url(input.contentUrl, input.siteUrl),
		caption: input.caption,
		width: input.width,
		height: input.height,
	});
}
export function buildVideoObject(input: VideoObjectInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "VideoObject",
		"@id": id("VideoObject", input, "video"),
		name: input.name,
		description: input.description,
		thumbnailUrl: image(input.thumbnailUrl, input.siteUrl),
		uploadDate: date(input.uploadDate),
		contentUrl: url(input.contentUrl, input.siteUrl),
		embedUrl: url(input.embedUrl, input.siteUrl),
		duration: input.duration,
	});
}
export function buildAggregateRating(input: AggregateRatingInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "AggregateRating",
		ratingValue: input.ratingValue,
		ratingCount: input.ratingCount,
		reviewCount: input.reviewCount,
		bestRating: input.bestRating,
		worstRating: input.worstRating,
	});
}
export function buildReview(input: ReviewInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "Review",
		author: author(input.author, input.siteUrl),
		reviewRating: input.reviewRating && {
			"@type": "Rating",
			...input.reviewRating,
		},
		reviewBody: input.reviewBody,
		datePublished: date(input.datePublished),
	});
}
export function buildProduct(input: ProductInput): SchemaNode {
	return clean({
		"@context": context,
		"@type": "Product",
		"@id": id("Product", input, "product"),
		name: input.name,
		url: url(input.url, input.siteUrl),
		description: input.description,
		image: image(input.image, input.siteUrl),
		brand:
			typeof input.brand === "string"
				? { "@type": "Brand", name: input.brand }
				: input.brand &&
					buildOrganization({
						...input.brand,
						siteUrl: input.siteUrl ?? input.brand.siteUrl,
					}),
		sku: input.sku,
		offers: Array.isArray(input.offers)
			? input.offers.map((offer) =>
					buildOffer({ ...offer, siteUrl: input.siteUrl ?? offer.siteUrl }),
				)
			: input.offers &&
				buildOffer({
					...input.offers,
					siteUrl: input.siteUrl ?? input.offers.siteUrl,
				}),
		aggregateRating:
			input.aggregateRating && buildAggregateRating(input.aggregateRating),
		review:
			input.review &&
			(Array.isArray(input.review)
				? input.review.map((review) =>
						buildReview({
							...review,
							siteUrl: input.siteUrl ?? review.siteUrl,
						}),
					)
				: buildReview({
						...input.review,
						siteUrl: input.siteUrl ?? input.review.siteUrl,
					})),
	});
}
export function buildFAQPage(
	questions: Array<{ question: string; answer: string }>,
): SchemaNode {
	return clean({
		"@context": context,
		"@type": "FAQPage",
		mainEntity: questions.map(({ question, answer }) => ({
			"@type": "Question",
			name: question,
			acceptedAnswer: { "@type": "Answer", text: answer },
		})),
	});
}
export function buildHowTo(input: {
	name: string;
	steps: Array<{ name: string; text: string; image?: ImageValue }>;
	totalTime?: string;
	siteUrl?: string | URL;
}): SchemaNode {
	return clean({
		"@context": context,
		"@type": "HowTo",
		name: input.name,
		totalTime: input.totalTime,
		step: input.steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
			image: image(step.image, input.siteUrl),
		})),
	});
}
export function composeGraph(
	...inputs: Array<SchemaInput | undefined>
): SchemaGraph {
	const nodes = inputs
		.flatMap((input) => (input ? (Array.isArray(input) ? input : [input]) : []))
		.map((node) => clean(node));
	const unique = new Map<string, SchemaNode>();
	nodes.forEach((node) =>
		unique.set(node["@id"] ? String(node["@id"]) : JSON.stringify(node), node),
	);
	return {
		"@context": context,
		"@graph": [...unique.values()].map(
			({ "@context": _context, ...node }) => node,
		),
	};
}
