'use client';

import { Logo } from '@/components/icons';
import { useState, useEffect } from 'react';

export function AppFooter() {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full shrink-0 border-t bg-background/80 px-4 py-6 backdrop-blur-sm sm:px-8 print:hidden">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-muted-foreground" />
          <span className="font-semibold">Resumeeee</span>
        </div>
        <p>© {year} Resumeeee. All Rights Reserved.</p>
        <a
          href="https://geraldaton.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Contact the Developer
        </a>
      </div>
    </footer>
  );
}
