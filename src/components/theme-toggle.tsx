'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      const shouldDark = stored ? stored === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', shouldDark);
      setIsDark(shouldDark);
    } catch {
      // no-op
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // no-op
    }
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema oscuro"
      className="fixed bottom-4 right-4 z-50 rounded-md border px-3 py-1.5 text-sm bg-white text-black shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
    >
      {isDark ? '🌙 Dark' : '🌞 Light'}
    </button>
  );
}

