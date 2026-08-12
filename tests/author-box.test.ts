import { describe, expect, it } from "vitest";
import { authorProfile } from "../src/author-profile";

describe("editorial author identity", () => {
	it("contains the supplied profile and topics", () => {
		expect(authorProfile).toEqual({
			name: "Eloy Martínez Cuesta",
			url: "https://eloymartinezcuesta.com",
			image: "/eloy-martinez.webp",
			bio: "Construyo aplicaciones, APIs y herramientas con software e IA, aprendiendo a través de proyectos reales. Me interesa especialmente convertir problemas y procesos complejos en soluciones simples, útiles y automatizables.",
			topics: ["Software", "APIs", "Automatización", "IA"],
		});
	});
});
