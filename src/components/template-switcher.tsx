'use client';

import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { type ResumeSchema } from '@/lib/schemas';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const templates = [
  {
    name: 'modern',
    label: 'Modern',
    image: 'https://placehold.co/150x210.png',
    hint: 'sleek professional'
  },
  {
    name: 'classic',
    label: 'Classic',
    image: 'https://placehold.co/150x210.png',
    hint: 'traditional document'
  },
  {
    name: 'creative',
    label: 'Creative',
    image: 'https://placehold.co/150x210.png',
    hint: 'stylish design'
  },
] as const;

export function TemplateSwitcher() {
  const form = useFormContext<ResumeSchema>();

  return (
    <FormField
      control={form.control}
      name="template"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Choose a template</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {templates.map((template) => (
                <FormItem key={template.name}>
                  <FormControl>
                    <RadioGroupItem value={template.name} className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <Card
                      className={cn(
                        'transition-all',
                        field.value === template.name &&
                          'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      )}
                    >
                      <CardContent className="flex flex-col items-center gap-2 p-4">
                        <Image
                          src={template.image}
                          alt={`${template.label} template preview`}
                          width={150}
                          height={210}
                          className="rounded-md object-cover"
                          data-ai-hint={template.hint}
                        />
                        <span className="font-semibold">{template.label}</span>
                      </CardContent>
                    </Card>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
