'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, defaultResumeData, type ResumeSchema } from '@/lib/schemas';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { AppHeader } from '@/components/app-header';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRef, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseResumeAction } from '@/app/actions';


export function ResumeBuilder() {
  const form = useForm<ResumeSchema>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();
  const [isUploading, startUploadingTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a plain text (.txt) file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast({
          variant: 'destructive',
          title: 'Empty File',
          description: 'The selected file is empty.',
        });
        return;
      }
      startUploadingTransition(async () => {
        try {
          const { aiConfig } = form.getValues();
          const parsedData = await parseResumeAction({ resumeText: text, aiConfig });
          
          const finalData = {
            ...form.getValues(), // preserve existing values
            ...parsedData, // overwrite with parsed data
            experience: parsedData.experience.map(exp => ({...exp, id: crypto.randomUUID()})),
            education: parsedData.education.map(edu => ({...edu, id: crypto.randomUUID()})),
            skills: parsedData.skills.map(skill => ({...skill, id: crypto.randomUUID()})),
          };

          form.reset(finalData);
          toast({
            title: 'Success!',
            description: 'Your resume has been parsed and loaded into the form.',
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Parsing Failed',
            description: (error as Error).message,
          });
        }
      });
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error reading file',
            description: 'Could not read the content from the selected file.',
        });
    };
    reader.readAsText(file);

    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <FormProvider {...form}>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt"
        className="hidden"
      />
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader onUploadClick={handleUploadClick} isUploading={isUploading} />
        <main className="flex-1 overflow-hidden">
          {isDesktop ? (
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={40}>
                <div className="h-full overflow-y-auto p-4 sm:p-8 print:hidden">
                  <ResumeForm />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-primary/20 transition-colors hover:bg-primary/40 data-[resize-handle-state=drag]:bg-primary print:hidden" />
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full overflow-y-auto bg-muted/30 p-4 sm:p-8">
                  <ResumePreview />
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            <div className="h-full overflow-y-auto p-4 sm:p-8">
              <Tabs defaultValue="form" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="form">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="mt-4">
                  <ResumeForm />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                   <ResumePreview />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </FormProvider>
  );
}