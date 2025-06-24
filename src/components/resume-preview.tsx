'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernTemplate } from '@/components/templates/modern-template';
import { ClassicTemplate } from '@/components/templates/classic-template';
import { CreativeTemplate } from '@/components/templates/creative-template';
import { MinimalistTemplate } from '@/components/templates/minimalist-template';
import { ProfessionalTemplate } from '@/components/templates/professional-template';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  professional: ProfessionalTemplate,
};

export function ResumePreview() {
  const { control } = useFormContext<ResumeSchema>();
  const data = useWatch({ control });
  const { coverLetter, template } = data;

  const SelectedTemplate = templates[template] || ModernTemplate;

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
          <div className="flex-1 overflow-y-auto">
            <div id="printable-area" className="bg-white text-gray-900">
              <TabsContent value="resume" className="m-0">
                <SelectedTemplate data={data} />
              </TabsContent>
              <TabsContent value="cover-letter" className="m-0">
                <div className="p-6 sm:p-8">
                  {coverLetter ? (
                    <div className="prose prose-sm max-w-full">
                      <pre className="whitespace-pre-wrap font-body text-sm">
                        {coverLetter}
                      </pre>
                    </div>
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
