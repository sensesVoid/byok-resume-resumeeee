'use client';

import { useFormContext } from 'react-hook-form';
import type { ResumeSchema } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

interface MonetizationSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MonetizationSettingsModal({ isOpen, onOpenChange }: MonetizationSettingsModalProps) {
  const form = useFormContext<ResumeSchema>();

  const donationConfig = form.watch('donationConfig');
  const advertisements = form.watch('advertisements');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Monetization Settings</DialogTitle>
          <DialogDescription>
            Configure donation methods and advertisement slots for your app.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donations" className="pt-4">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground px-1 mb-4">Enable donation methods to receive support. A "Donate" button will appear in the header.</p>
                
                {/* PayPal Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Image src="/images/paypal.png" alt="PayPal Logo" width={24} height={24} />
                           PayPal
                        </h4>
                        <FormField
                            control={form.control}
                            name="donationConfig.paypal.enabled"
                            render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>{field.value ? 'Enabled' : 'Disabled'}</FormLabel>
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="donationConfig.paypal.username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>PayPal.me Username</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="your-username" disabled={!donationConfig.paypal.enabled} />
                            </FormControl>
                             <FormDescription>
                                Find this at <a href="https://www.paypal.com/paypalme" target="_blank" rel="noopener noreferrer" className="underline">paypal.com/paypalme</a>. Enter only your username.
                             </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Maya Section */}
                <div className="space-y-4 rounded-lg border p-4 mt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Image src="/images/maya.png" alt="Maya Logo" width={24} height={24} />
                          Maya
                        </h4>
                        <FormField
                            control={form.control}
                            name="donationConfig.maya.enabled"
                            render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>{field.value ? 'Enabled' : 'Disabled'}</FormLabel>
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="donationConfig.maya.number"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Maya Phone Number</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="09123456789" disabled={!donationConfig.maya.enabled} />
                            </FormControl>
                             <FormDescription>
                                Your public Maya number for receiving payments. The app will generate a QR code from this number.
                             </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advertisements" className="pt-4">
            <div className="space-y-6">
                {/* Top Ad Section */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Top Ad Slot</h4>
                    <FormField
                      control={form.control}
                      name="advertisements.topAd.enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>{field.value ? 'Enabled' : 'Disabled'}</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="advertisements.topAd.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/ad.png"
                            disabled={!advertisements.topAd.enabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="advertisements.topAd.linkUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com"
                            disabled={!advertisements.topAd.enabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bottom Ad Section */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Bottom Ad Slot</h4>
                    <FormField
                      control={form.control}
                      name="advertisements.bottomAd.enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>{field.value ? 'Enabled' : 'Disabled'}</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="advertisements.bottomAd.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/ad.png"
                            disabled={!advertisements.bottomAd.enabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="advertisements.bottomAd.linkUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com"
                            disabled={!advertisements.bottomAd.enabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
