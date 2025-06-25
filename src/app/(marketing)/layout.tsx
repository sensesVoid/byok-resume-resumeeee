
import { AppFooter } from '@/components/app-footer';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Resumeeee</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          <Button asChild>
            <Link href="/">Open App</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
