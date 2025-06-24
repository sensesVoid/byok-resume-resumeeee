'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { defaultResumeData } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { PayPalIcon, MayaIcon } from '@/components/payment-icons';
import QRCode from 'qrcode.react';


interface DonationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function DonationModal({ isOpen, onOpenChange }: DonationModalProps) {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Support the Creator</DialogTitle>
          <DialogDescription>
            Your donation helps keep this app running and free to use.
          </DialogDescription>
        </DialogHeader>
        <main className="w-full">
          {isAnyEnabled ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {config.paypal.enabled && config.paypal.username && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PayPalIcon className="h-6 w-6" /> Donate with PayPal</CardTitle>
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
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                       {/* The type for QRCode value is string, so we need to ensure number is a string */}
                       <QRCode value={String(config.maya.number)} size={192} />
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
              <Card className="text-center p-8 mt-4">
                  <CardTitle>Donation Methods Not Set Up</CardTitle>
                  <DialogDescription className="mt-2">The creator of this app has not configured any donation methods yet.</DialogDescription>
              </Card>
          )}
        </main>
      </DialogContent>
    </Dialog>
  );
}
