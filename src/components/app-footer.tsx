'use client';

import { Logo } from '@/components/icons';

export function AppFooter() {
  return (
    <footer className="w-full shrink-0 border-t bg-background/80 px-4 py-6 backdrop-blur-sm sm:px-8 print:hidden">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-muted-foreground" />
            <span className="font-semibold">Resumeeee</span>
        </div>
        <p>© {new Date().getFullYear()} Resumeeee. All Rights Reserved.</p>
        <p>
            An AI-powered open source project.
        </p>
      </div>
    </footer>
  );
}
