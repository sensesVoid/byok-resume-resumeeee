
'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { resumeSchema, type ResumeSchema } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const dynamicTemplates = {
  modern: dynamic(() => import('@/components/templates/modern-template').then(mod => mod.ModernTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  classic: dynamic(() => import('@/components/templates/classic-template').then(mod => mod.ClassicTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  creative: dynamic(() => import('@/components/templates/creative-template').then(mod => mod.CreativeTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  minimalist: dynamic(() => import('@/components/templates/minimalist-template').then(mod => mod.MinimalistTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  professional: dynamic(() => import('@/components/templates/professional-template').then(mod => mod.ProfessionalTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  elegant: dynamic(() => import('@/components/templates/elegant-template').then(mod => mod.ElegantTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  geometric: dynamic(() => import('@/components/templates/geometric-template').then(mod => mod.GeometricTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  technical: dynamic(() => import('@/components/templates/technical-template').then(mod => mod.TechnicalTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  corporate: dynamic(() => import('@/components/templates/corporate-template').then(mod => mod.CorporateTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  infographic: dynamic(() => import('@/components/templates/infographic-template').then(mod => mod.InfographicTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  academic: dynamic(() => import('@/components/templates/academic-template').then(mod => mod.AcademicTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  startup: dynamic(() => import('@/components/templates/startup-template').then(mod => mod.StartupTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  executive: dynamic(() => import('@/components/templates/executive-template').then(mod => mod.ExecutiveTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  marketing: dynamic(() => import('@/components/templates/marketing-template').then(mod => mod.MarketingTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  designer: dynamic(() => import('@/components/templates/designer-template').then(mod => mod.DesignerTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  developer: dynamic(() => import('@/components/templates/developer-template').then(mod => mod.DeveloperTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  legal: dynamic(() => import('@/components/templates/legal-template').then(mod => mod.LegalTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  medical: dynamic(() => import('@/components/templates/medical-template').then(mod => mod.MedicalTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  'two-tone': dynamic(() => import('@/components/templates/two-tone-template').then(mod => mod.TwoToneTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
  compact: dynamic(() => import('@/components/templates/compact-template').then(mod => mod.CompactTemplate), { loading: () => <Skeleton className="w-full h-[1123px]" /> }),
};

export function ResumePreview() {
  const { control } = useFormContext<ResumeSchema>();
  const watchedData = useWatch({ control });

  // Validate the data on every render to ensure it's a complete object.
  // This prevents errors when the form state is initializing.
  const validationResult = resumeSchema.safeParse(watchedData);

  if (!validationResult.success) {
    return (
      <div className="h-full w-full overflow-hidden p-8">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  const data = validationResult.data;
  const { coverLetter, template } = data;

  const SelectedTemplate = dynamicTemplates[template] || dynamicTemplates.modern;

  return (
    <Card className="h-full w-full overflow-hidden shadow-lg print:shadow-none print:border-none">
      <CardContent className="h-full p-0">
        <Tabs defaultValue="resume" className="flex h-full flex-col">
          <TabsList className="mx-4 mt-4 shrink-0 print:hidden">
            <TabsTrigger value="resume">
              <FileText className="mr-2 h-4 w-4" /> Resume
            </TabsTrigger>
            <TabsTrigger value="cover-letter">
              <FileText className="mr-2 h-4 w-4" /> Cover Letter
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto pt-6">
            <div id="printable-area" className="bg-white text-gray-900">
              <TabsContent value="resume" className="m-0 resume-content-wrapper">
                <SelectedTemplate data={data} />
              </TabsContent>
              <TabsContent
                value="cover-letter"
                className="m-0 cover-letter-content-wrapper"
              >
                <div className="p-6 sm:p-8">
                  {coverLetter ? (
                    <>
                      <div className="whitespace-pre-wrap font-body text-sm">
                        {coverLetter}
                      </div>
                      <div className="mt-6 text-center text-xs text-muted-foreground">
                        <p className="italic">
                          This cover letter was generated by AI. Please review
                          and edit carefully before sending.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-96 items-center justify-center text-center text-gray-500">
                      <div className="space-y-2">
                        <FileText size={48} className="mx-auto" />
                        <p>Your generated cover letter will appear here.</p>
                        <p className="text-xs">
                          Go to the "AI Cover Letter Generator" section to
                          create one.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
