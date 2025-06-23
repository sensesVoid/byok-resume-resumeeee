'use client';

import { useFormContext } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

import { ModernTemplate } from '@/components/templates/modern-template';
import { ClassicTemplate } from '@/components/templates/classic-template';
import { CreativeTemplate } from '@/components/templates/creative-template';

const templates = [
  {
    name: 'modern',
    label: 'Modern',
    component: ModernTemplate,
  },
  {
    name: 'classic',
    label: 'Classic',
    component: ClassicTemplate,
  },
  {
    name: 'creative',
    label: 'Creative',
    component: CreativeTemplate,
  },
] as const;


export function TemplateSwitcher() {
  const form = useFormContext<ResumeSchema>();
  const data = form.watch();

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
              {templates.map((template) => {
                const TemplateComponent = template.component;
                return (
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
                        <CardContent className="flex flex-col items-center gap-2 p-2">
                          <div className="h-[210px] w-[150px] overflow-hidden rounded-md border bg-white">
                            <div className="origin-top-left scale-[0.25] transform">
                               <TemplateComponent data={data} />
                            </div>
                          </div>
                          <span className="font-semibold">{template.label}</span>
                        </CardContent>
                      </Card>
                    </FormLabel>
                  </FormItem>
                )
              })}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
