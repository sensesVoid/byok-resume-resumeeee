
'use client';

import Link from 'next/link';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { defaultResumeData } from '@/lib/schemas';
import { QRCode } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { PayPalIcon, MayaIcon } from '@/components/payment-icons';

export default function DonatePage() {
  const { toast } = useToast();
  const config = defaultResumeData.donationConfig;
  const isAnyEnabled = config.maya.enabled || config.paypal.enabled;
  const paypalLink = `https://paypal.me/${config.paypal.username}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `Your ${type} has been copied.`,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 text-foreground">
       <div className="w-full max-w-4xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft size={16} />
                Back to Resume Builder
            </Link>
       </div>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Support the Creator</h1>
        <p className="mt-2 text-muted-foreground">Your donation helps keep this app running and free to use.</p>
      </header>

      <main className="w-full max-w-4xl">
        {isAnyEnabled ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.paypal.enabled && config.paypal.username && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PayPalIcon className="h-6 w-6" /> Donate with PayPal</CardTitle>
                  <CardDescription>Scan the QR code with your phone or use the link below.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <QRCode value={paypalLink} size={192} />
                  </div>
                  <div className="text-center w-full">
                     <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="font-mono text-sm break-all hover:underline">{paypalLink}</a>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleCopy(paypalLink, 'PayPal link')}>
                        <Copy size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {config.maya.enabled && config.maya.number && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MayaIcon className="h-6 w-6 text-[#00a9e0]" /> Donate with Maya</CardTitle>
                  <CardDescription>Scan the QR code in your Maya app to donate.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                     <QRCode value={config.maya.number} size={192} />
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-sm">{config.maya.number}</p>
                     <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleCopy(config.maya.number || '', 'Maya number')}>
                        <Copy size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
            <Card className="text-center p-8">
                <CardTitle>Donation Methods Not Set Up</CardTitle>
                <CardDescription className="mt-2">The creator of this app has not configured any donation methods yet.</CardDescription>
            </Card>
        )}
      </main>
    </div>
  );
}
