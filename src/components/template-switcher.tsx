'use client';

import { useFormContext } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const templates = [
  { name: 'modern', label: 'Modern' },
  { name: 'classic', label: 'Classic' },
  { name: 'creative', label: 'Creative' },
  { name: 'minimalist', label: 'Minimalist' },
  { name: 'professional', label: 'Professional' },
  { name: 'elegant', label: 'Elegant' },
  { name: 'geometric', label: 'Geometric' },
  { name: 'technical', label: 'Technical' },
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
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <Button
                  key={template.name}
                  type="button"
                  variant={
                    field.value === template.name ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => field.onChange(template.name)}
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
