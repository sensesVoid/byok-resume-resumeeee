'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resumeSchema,
  defaultResumeData,
  type ResumeSchema,
} from '@/lib/schemas';
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
import { useRef, useTransition, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseResumeAction, calculateAtsScoreAction } from '@/app/actions';
import type { CalculateAtsScoreOutput } from '@/ai/flows/calculate-ats-score';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AtsChecker } from '@/components/ats-checker';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import { ScrollArea } from '@/components/ui/scroll-area';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// Set worker source for pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

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
  const [isDownloading, startDownloadingTransition] = useTransition();

  const [atsResult, setAtsResult] =
    useState<CalculateAtsScoreOutput | null>(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [atsCheckType, setAtsCheckType] = useState<'resume' | 'cover-letter'>(
    'resume'
  );

  const aiPowered = form.watch('aiPowered');
  const coverLetter = form.watch('coverLetter');

  const handleDownloadPdf = async (target: 'resume' | 'cover-letter') => {
    startDownloadingTransition(async () => {
      const selector =
        target === 'resume'
          ? '.resume-content-wrapper'
          : '.cover-letter-content-wrapper';
      
      const element = document.querySelector(selector) as HTMLElement | null;
  
      if (!element) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not find the content to download.',
        });
        return;
      }
      
      toast({ title: 'Preparing PDF...', description: 'Please wait while we generate your document.' });
  
      try {
          document.body.classList.add(`printing-${target}`);
  
          const canvas = await html2canvas(element, {
              scale: 2, 
              useCORS: true,
              logging: false,
          });
          
          document.body.classList.remove(`printing-${target}`);
  
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
              orientation: 'p',
              unit: 'mm',
              format: 'a4',
          });
  
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          
          const imgHeight = canvasHeight * pdfWidth / canvasWidth;
          let heightLeft = imgHeight;
          let position = 0;
  
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
  
          while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
          }
          
          pdf.save(`${target}.pdf`);
  
          toast({ title: 'Download Started!', description: `Your ${target}.pdf is being downloaded.` });
  
      } catch (error) {
          console.error("Error generating PDF:", error);
          toast({
              variant: 'destructive',
              title: 'PDF Generation Failed',
              description: 'An unexpected error occurred. Please try again.',
          });
          document.body.classList.remove(`printing-${target}`);
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      file.type !== 'text/plain' &&
      !file.name.endsWith('.txt') &&
      file.type !== 'application/pdf' &&
      !file.name.endsWith('.pdf')
    ) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a plain text (.txt) or PDF (.pdf) file.',
      });
      if (event.target) event.target.value = '';
      return;
    }

    const originalValues = form.getValues();

    startUploadingTransition(async () => {
      let text = '';
      try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items
              .map((item) => ('str' in item ? item.str : ''))
              .join(' ');
            if (i < numPages) {
              text += '\n\n'; // Add more space between pages
            }
          }
        } else {
          text = await file.text();
        }

        if (!text.trim()) {
          toast({
            variant: 'destructive',
            title: 'Empty File',
            description: 'The file appears to be empty or contains no text.',
          });
          return;
        }

        // AI will analyze and parse the resume
        const parsedData = await parseResumeAction({
          resumeText: text,
          aiConfig: originalValues.aiConfig,
        });

        // If successful, populate the form with extracted details
        const finalData = {
          ...originalValues,
          ...parsedData,
          personalInfo: {
            ...parsedData.personalInfo,
            photo: originalValues.personalInfo.photo, // Explicitly preserve photo
          },
          experience: parsedData.experience.map((exp) => ({
            ...exp,
            id: crypto.randomUUID(),
          })),
          education: parsedData.education.map((edu) => ({
            ...edu,
            id: crypto.randomUUID(),
          })),
          skills: parsedData.skills.map((skill) => ({
            ...skill,
            id: crypto.randomUUID(),
          })),
        };

        form.reset(finalData);
        toast({
          title: 'Success!',
          description: 'Your resume has been parsed and loaded into the form.',
        });
      } catch (error) {
        // If parsing fails, show a toast and leave the original form data intact.
        toast({
          variant: 'destructive',
          title: 'Parsing Failed',
          description:
            (error as Error).message ||
            'An unknown error occurred during parsing.',
        });
      }
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleAddMissingSkills = (skillsToAdd: string[]) => {
    const currentSkills = form.getValues('skills');
    const currentSkillNames = new Set(currentSkills.map(s => s.name.toLowerCase()));

    const newSkills = skillsToAdd.filter(
      (skill) => !currentSkillNames.has(skill.toLowerCase())
    );

    if (newSkills.length === 0) {
      toast({
        title: 'No new skills to add',
        description: 'All suggested skills are already in your resume.',
      });
      return;
    }

    const skillsToAppend = newSkills.map(name => ({
      id: crypto.randomUUID(),
      name,
    }));

    form.setValue('skills', [...currentSkills, ...skillsToAppend], {
      shouldValidate: true,
    });

    toast({
      title: 'Skills Added!',
      description: `${newSkills.length} new skill(s) have been added to your resume.`,
    });
    setIsAtsModalOpen(false); // Close modal after adding skills
  };

  const handleCalculateAtsScore = (type: 'resume' | 'cover-letter') => {
    const {
      personalInfo,
      summary,
      experience,
      education,
      skills,
      jobDescription,
      aiConfig,
      coverLetter,
    } = form.getValues();

    if (!jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job Description Missing',
        description:
          'Please provide a job description in the "ATS & Job Matching" section to calculate the ATS score.',
      });
      return;
    }

    if (type === 'cover-letter' && !coverLetter) {
      toast({
        variant: 'destructive',
        title: 'Cover Letter is Empty',
        description:
          'Please generate a cover letter before calculating its ATS score.',
      });
      return;
    }

    setAtsCheckType(type);
    setIsAtsModalOpen(true);

    let documentText = '';
    if (type === 'resume') {
      documentText = `
      Name: ${personalInfo.name}
      Email: ${personalInfo.email}
      ${personalInfo.phone ? `Phone: ${personalInfo.phone}` : ''}
      ${personalInfo.website ? `Website: ${personalInfo.website}` : ''}
      ${personalInfo.location ? `Location: ${personalInfo.location}` : ''}

      Summary: ${summary}

      Experience:
      ${experience
        .map(
          (exp) => `
        - ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${
            exp.endDate || 'Present'
          })
          ${exp.location ? `, ${exp.location}` : ''}
          Description: ${exp.description}
      `
        )
        .join('\n')}

      Education:
      ${education
        .map(
          (edu) => `
        - ${edu.degree} from ${edu.institution} (Graduated: ${
            edu.graduationDate
          })
          ${edu.location ? `, ${edu.location}` : ''}
          ${edu.description ? `Details: ${edu.description}` : ''}
      `
        )
        .join('\n')}

      Skills: ${skills.map((s) => s.name).join(', ')}
    `;
    } else {
      documentText = coverLetter || '';
    }

    startAtsTransition(async () => {
      try {
        setAtsResult(null); // Clear previous results
        const result = await calculateAtsScoreAction({
          documentText,
          documentType: type,
          jobDescription,
          aiConfig,
        });
        setAtsResult(result);
        toast({
          title: 'Success!',
          description: `Your ${type} ATS score has been calculated.`,
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
        accept=".txt,.pdf"
        className="hidden"
      />
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader
          onUploadClick={handleUploadClick}
          isUploading={isUploading}
          onCalculateAtsScore={handleCalculateAtsScore}
          isCalculatingAts={isCalculatingAts}
          isAiPowered={aiPowered}
          onDownloadResume={() => handleDownloadPdf('resume')}
          onDownloadCoverLetter={() => handleDownloadPdf('cover-letter')}
          isCoverLetterEmpty={!coverLetter}
          isDownloading={isDownloading}
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
                <TabsContent value="preview" className="mt-4 pt-6">
                  <ResumePreview />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>

      <Dialog open={isAtsModalOpen} onOpenChange={setIsAtsModalOpen}>
        <DialogContent className="sm:max-w-[625px] grid grid-rows-[auto_minmax(0,1fr)] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>ATS Score Checker</DialogTitle>
            <DialogDescription>
              Results of the analysis of your {atsCheckType} against the provided
              job description.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-6">
            <AtsChecker
              isPending={isCalculatingAts}
              atsResult={atsResult}
              documentType={atsCheckType}
              onAddMissingSkills={atsCheckType === 'resume' ? handleAddMissingSkills : undefined}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
