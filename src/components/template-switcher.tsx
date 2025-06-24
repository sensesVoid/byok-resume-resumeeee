'use client';

import { useFormContext } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        <FormItem>
          <FormLabel>Choose a template</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.name} value={template.name}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
