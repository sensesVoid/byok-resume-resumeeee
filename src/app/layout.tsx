
import type { Metadata } from 'next';
import { Inter, Roboto, Lato, Merriweather, Montserrat, Roboto_Slab, Playfair_Display, Source_Sans_3 } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], variable: '--font-roboto-slab' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });
const sourceSansPro = Source_Sans_3({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-source-sans-pro' });

export const metadata: Metadata = {
  title: 'Resumeeee - AI-Powered Resume Builder',
  description:
    'Build your professional resume and cover letter with AI assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6611183288979464" />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6611183288979464"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
        />
      </head>
      {/* Added gradient background for glassmorphism */}
      <body
        className={cn(
          'font-inter antialiased bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950 dark:via-sky-950 dark:to-cyan-950',
          inter.variable,
          roboto.variable,
          lato.variable,
          merriweather.variable,
          montserrat.variable,
          robotoSlab.variable,
          playfairDisplay.variable,
          sourceSansPro.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
