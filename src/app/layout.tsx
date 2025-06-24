import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Resumeeee - AI-Powered Resume Builder',
  description: 'Build your professional resume and cover letter with AI assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Added gradient background for glassmorphism */}
      <body className="font-body antialiased bg-[#ecf0f1] dark:bg-slate-900 bg-gradient-to-br from-blue-50 via-[#ecf0f1] to-blue-200 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
