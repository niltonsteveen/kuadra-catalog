import { NextResponse } from 'next/server';

export async function GET() {
  // Simula multi‑tenant usando una constante por ahora
  const style = 'moderno' as 'moderno' | 'clasico' | 'neutro';

  const typography =
    style === 'moderno'
      ? { sans: 'Manrope', heading: 'Manrope' }
      : style === 'clasico'
      ? { sans: 'IBM Plex Mono', heading: 'IBM Plex Mono' }
      : { sans: 'Manrope', heading: 'Manrope' };

  // Usa un valor de color real (no nombre). Elegimos OKLCH para mejor perceptualidad
  // y porque Tailwind v4 admite valores arbitrarios modernos.
  const primaryColor = 'oklch(0.65 0.20 300)';

  // Ajustes de estilo derivados (ej.: bordes redondeados vs. rectos)
  const radius = style === 'moderno' ? '0.75rem' : style === 'clasico' ? '0px' : '0.5rem';

  const mock = {
    tenantId: '213132132',
    slug: 'micomercio',
    images: {
      logo: 'https://cdn.kuadra.com/213132132/logo.png',
      banner: 'https://cdn.kuadra.com/213132132/banner.jpg',
    },
    primaryColor, // valor OKLCH compatible con Tailwind via utilidades arbitrarias
    style, // determina tipografía y otros rasgos del diseño
    typography, // derivado de style
    tokens: { radius },
    mode: 'auto' as 'light' | 'dark' | 'auto',
    faqs: [
      { q: '¿Cómo hago una precompra?', a: 'Agrega productos y confirma en checkout.' },
      { q: '¿Puedo cambiar mi pedido?', a: 'Contacta al comercio antes de confirmar.' },
    ],
    featuredCategoryId: 'bebidas',
  };

  return NextResponse.json(mock);
}
