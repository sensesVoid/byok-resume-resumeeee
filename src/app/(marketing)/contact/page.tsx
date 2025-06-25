
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Resumeeee',
  description: 'Get in touch with the Resumeeee team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
       <div className="space-y-8">
         <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
            <p className="mt-4 text-xl text-muted-foreground">
                Have questions, feedback, or a bug to report?
            </p>
         </div>

        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                    The best way to reach out is through the developer's personal channels.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Resumeeee is a passion project created and maintained by a solo developer. For any inquiries, bug reports, or feature suggestions, please feel free to reach out.
                </p>
                <Button asChild className="w-full">
                    <a href="https://geraldaton.xyz" target="_blank" rel="noopener noreferrer">
                        Contact the Developer
                    </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                    Please note that while all feedback is appreciated, response times may vary.
                </p>
            </CardContent>
        </Card>

       </div>
    </div>
  );
}
