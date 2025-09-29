import { NextResponse } from "next/server";
import { DEFAULT_PRIMARY_PALETTE, PRIMARY_TONES } from "@/theme/colors";

export async function GET() {
  // Simula multi-tenant usando una constante por ahora
  const style = "moderno" as "moderno" | "clasico" | "neutro";

  const typography =
    style === "moderno"
      ? { sans: "Manrope", heading: "Manrope" }
      : style === "clasico"
      ? { sans: "IBM Plex Mono", heading: "IBM Plex Mono" }
      : { sans: "Manrope", heading: "Manrope" };

  const primaryPalette = Object.fromEntries(
    PRIMARY_TONES.map((tone) => [`primary-${tone}`, DEFAULT_PRIMARY_PALETTE[tone]] as const),
  );

  const primaryColor = DEFAULT_PRIMARY_PALETTE["500"];

  const radius = style === "moderno" ? "0.75rem" : style === "clasico" ? "0px" : "0.5rem";

  const mock = {
    tenantId: "213132132",
    slug: "micomercio",
    images: {
      logo: "https://cdn.kuadra.com/213132132/logo.png",
      banner: "https://cdn.kuadra.com/213132132/banner.jpg",
    },
    primaryColor,
    colors: { primary: primaryPalette },
    style,
    typography,
    tokens: { radius },
    mode: "auto" as "light" | "dark" | "auto",
    faqs: [
      { q: "Como hago una precompra?", a: "Agrega productos y confirma en checkout." },
      { q: "Puedo cambiar mi pedido?", a: "Contacta al comercio antes de confirmar." },
    ],
    featuredCategoryId: "bebidas",
  };

  return NextResponse.json(mock);
}
