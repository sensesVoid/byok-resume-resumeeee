
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
import { User } from 'lucide-react';

export const templates = [
  { name: 'modern', label: 'Modern', hasPhoto: true },
  { name: 'classic', label: 'Classic', hasPhoto: false },
  { name: 'creative', label: 'Creative', hasPhoto: true },
  { name: 'minimalist', label: 'Minimalist', hasPhoto: false },
  { name: 'professional', label: 'Professional', hasPhoto: true },
  { name: 'elegant', label: 'Elegant', hasPhoto: false },
  { name: 'geometric', label: 'Geometric', hasPhoto: false },
  { name: 'technical', label: 'Technical', hasPhoto: false },
  { name: 'corporate', label: 'Corporate', hasPhoto: true },
  { name: 'infographic', label: 'Infographic', hasPhoto: true },
  { name: 'academic', label: 'Academic', hasPhoto: false },
  { name: 'startup', label: 'Startup', hasPhoto: false },
  { name: 'executive', label: 'Executive', hasPhoto: true },
  { name: 'marketing', label: 'Marketing', hasPhoto: true },
  { name: 'designer', label: 'Designer', hasPhoto: true },
  { name: 'developer', label: 'Developer', hasPhoto: false },
  { name: 'legal', label: 'Legal', hasPhoto: false },
  { name: 'medical', label: 'Medical', hasPhoto: false },
  { name: 'two-tone', label: 'Two-Tone', hasPhoto: true },
  { name: 'compact', label: 'Compact', hasPhoto: false },
] as const;

export const templatesWithPhoto = templates
  .filter((t) => t.hasPhoto)
  .map((t) => t.name);

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
                  <div className="flex items-center gap-2">
                    {template.label}
                    {template.hasPhoto && (
                      <User className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
