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
import { useRef, useTransition, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseResumeAction, calculateAtsScoreAction } from '@/app/actions';
import type { CalculateAtsScoreOutput } from '@/ai/flows/calculate-ats-score';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AtsChecker } from '@/components/ats-checker';


export function ResumeBuilder() {
  const form = useForm<ResumeSchema>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, startUploadingTransition] = useTransition();
  const [isCalculatingAts, startAtsTransition] = useTransition();
  
  const [atsResult, setAtsResult] = useState<CalculateAtsScoreOutput | null>(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);

  const aiPowered = form.watch('aiPowered');

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

  const handleCalculateAtsScore = () => {
    const { personalInfo, summary, experience, education, skills, jobDescription, aiConfig } = form.getValues();
    
    if (!jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job Description Missing',
        description: 'Please provide a job description in the AI Tools section to calculate the ATS score.',
      });
      return;
    }

    setIsAtsModalOpen(true);

    const resumeText = `
      Name: ${personalInfo.name}
      Email: ${personalInfo.email}
      ${personalInfo.phone ? `Phone: ${personalInfo.phone}`: ''}
      ${personalInfo.website ? `Website: ${personalInfo.website}`: ''}
      ${personalInfo.location ? `Location: ${personalInfo.location}`: ''}

      Summary: ${summary}

      Experience:
      ${experience.map(exp => `
        - ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
          ${exp.location ? `, ${exp.location}`: ''}
          Description: ${exp.description}
      `).join('\n')}

      Education:
      ${education.map(edu => `
        - ${edu.degree} from ${edu.institution} (Graduated: ${edu.graduationDate})
          ${edu.location ? `, ${edu.location}`: ''}
          ${edu.description ? `Details: ${edu.description}`: ''}
      `).join('\n')}

      Skills: ${skills.map(s => s.name).join(', ')}
    `;

    startAtsTransition(async () => {
      try {
        setAtsResult(null); // Clear previous results
        const result = await calculateAtsScoreAction({ resumeText, jobDescription, aiConfig });
        setAtsResult(result);
        toast({
          title: 'Success!',
          description: 'Your ATS score has been calculated.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
        setAtsResult(null);
      }
    });
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
        <AppHeader 
          onUploadClick={handleUploadClick} 
          isUploading={isUploading}
          onCalculateAtsScore={handleCalculateAtsScore}
          isCalculatingAts={isCalculatingAts}
          isAiPowered={aiPowered}
        />
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

       <Dialog open={isAtsModalOpen} onOpenChange={setIsAtsModalOpen}>
          <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                  <DialogTitle>ATS Score Checker</DialogTitle>
                  <DialogDescription>
                      Results of the analysis of your resume against the provided job description.
                  </DialogDescription>
              </DialogHeader>
              <AtsChecker isPending={isCalculatingAts} atsResult={atsResult} />
          </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
