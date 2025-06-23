'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, defaultResumeData, type ResumeSchema } from '@/lib/schemas';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { AppHeader } from '@/components/app-header';

export function ResumeBuilder() {
  const form = useForm<ResumeSchema>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <div className="grid h-full md:grid-cols-2">
            <div className="h-full overflow-y-auto p-4 sm:p-8 print:hidden">
              <ResumeForm />
            </div>
            <div className="hidden h-full overflow-y-auto bg-muted/30 p-4 sm:p-8 md:block">
              <ResumePreview />
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}
