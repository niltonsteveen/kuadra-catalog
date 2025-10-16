'use client';

import { useEffect } from 'react';
import { PRIMARY_PALETTE_STORAGE_KEY, PRIMARY_COLOR_STORAGE_KEY, PRIMARY_TONES } from '@/theme/colors';

export function ClientHydration() {
  useEffect(() => {
    try {
      const root = document.documentElement;
      const body = document.body;
      const K = 'theme';
      const S = 'style';
      const R = 'radius';
      const P = PRIMARY_PALETTE_STORAGE_KEY;
      const C = PRIMARY_COLOR_STORAGE_KEY;
      const tones = PRIMARY_TONES;
      const H = new Date().getHours();
      const isNight = (H < 7 || H >= 19);

      // Aplicar tema
      let mode = localStorage.getItem(K);
      if (mode !== 'light' && mode !== 'dark' && mode !== 'auto') {
        mode = 'auto';
      }
      const effective = mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : (isNight ? 'dark' : 'light');
      if (effective === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Aplicar paleta de colores
      const storedPalette = localStorage.getItem(P);
      if (storedPalette) {
        try {
          const parsed = JSON.parse(storedPalette);
          for (const tone of tones) {
            const direct = typeof parsed?.[tone] === 'string' ? parsed[tone] : null;
            const prefixed = typeof parsed?.['primary-' + tone] === 'string' ? parsed['primary-' + tone] : null;
            const value = prefixed || direct;
            if (value) {
              root.style.setProperty('--kuadra-color-primary-' + tone, value);
            }
          }
        } catch {}
      } else {
        const legacy = localStorage.getItem(C);
        if (legacy) {
          root.style.setProperty('--kuadra-color-primary-500', legacy);
        }
      }

      // Aplicar radio
      const rd = localStorage.getItem(R);
      if (rd) {
        root.style.setProperty('--radius-md', rd);
      }

      // Aplicar estilo
      const resolveStyle = () => {
        const stored = localStorage.getItem(S);
        if (stored === 'moderno' || stored === 'clasico') {
          return stored;
        }
        localStorage.setItem(S, 'moderno');
        return 'moderno';
      };

      const current = resolveStyle();
      body.classList.remove('font-sans', 'font-mono');
      body.classList.add(current === 'clasico' ? 'font-mono' : 'font-sans');
      root.classList.remove('modern', 'classic');
      root.classList.add(current === 'clasico' ? 'classic' : 'modern');
    } catch {}
  }, []);

  return null;
}
