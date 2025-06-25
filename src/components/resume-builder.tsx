
'use client';

import { FormProvider, useForm, useWatch } from 'react-hook-form';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants, Button } from '@/components/ui/button';
import { AtsChecker } from '@/components/ats-checker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AboutModal } from '@/components/about-modal';
import { DonationModal } from './donation-modal';
import { AppFooter } from './app-footer';
import { AiTaskModal } from './ai-task-modal';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';
import { FileText, Loader2, FileDown } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

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
  const [isSaving, startSavingTransition] = useTransition();

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [atsResult, setAtsResult] =
    useState<CalculateAtsScoreOutput | null>(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<'resume' | 'cover-letter' | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [isAiTaskModalOpen, setIsAiTaskModalOpen] = useState(false);
  const [aiTaskTitle, setAiTaskTitle] = useState('');
  const [aiTaskMessages, setAiTaskMessages] = useState<string[]>([]);

  const [atsCheckType, setAtsCheckType] = useState<'resume' | 'cover-letter'>(
    'resume'
  );

  // --- PERFORMANCE OPTIMIZATIONS ---
  // 1. Watch all data for debounced saving and for the live preview modal.
  const watchedData = form.watch();
  const debouncedData = useDebounce(watchedData, 500);

  // 2. Watch specific fields for props to prevent unnecessary re-renders of child components like AppHeader.
  const aiPowered = useWatch({ control: form.control, name: 'aiPowered' });
  const coverLetter = useWatch({ control: form.control, name: 'coverLetter' });
  const template = useWatch({ control: form.control, name: 'template' });
  // --- END OPTIMIZATIONS ---
  
  // Monetization config is static and comes from the default data
  const { donationConfig } = defaultResumeData;
  const isDonationEnabled = donationConfig.paypal.enabled || donationConfig.maya.enabled;
  
  const SelectedTemplate = dynamicTemplates[template] || dynamicTemplates.modern;


  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeeee-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate against schema to prevent errors from outdated data
        const validation = resumeSchema.safeParse(parsedData);
        if (validation.success) {
          form.reset(validation.data);
          toast({
            title: 'Welcome Back!',
            description: 'Your previous session has been restored.',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    } finally {
      setIsDataLoaded(true);
    }
  }, [form, toast]);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isDataLoaded) return;

    try {
      localStorage.setItem('resumeeee-data', JSON.stringify(debouncedData));
    } catch (error) {
      console.error('Failed to save data to localStorage', error);
      toast({
            variant: 'destructive',
            title: 'Could not save progress',
            description: 'There was an issue saving your data to the browser. Your latest changes might not be persisted.'
        });
    }
  }, [debouncedData, isDataLoaded, toast]);
  
  const runAiTask = async <T,>(
    taskFn: () => Promise<T>,
    title: string,
    messages: string[]
  ): Promise<T | null> => {
    if (!form.getValues().aiPowered) {
      toast({
        variant: 'destructive',
        title: 'AI Not Enabled',
        description: 'Please enable AI features in the toolkit section first.',
      });
      return null;
    }

    setAiTaskTitle(title);
    setAiTaskMessages(messages);
    setIsAiTaskModalOpen(true);

    try {
      const result = await taskFn();
      setIsAiTaskModalOpen(false);
      return result;
    } catch (error) {
      setIsAiTaskModalOpen(false);
      // The individual action should show a more specific toast,
      // but we'll keep a generic one here as a fallback.
      if (!(error as Error).message.includes('The AI returned an invalid response')) {
         toast({
            variant: 'destructive',
            title: 'AI Task Failed',
            description: (error as Error).message || 'An unknown error occurred.',
         });
      }
      // Re-throw the error so the original caller can handle it if needed
      throw error;
    }
  };

  const handleDownloadPdf = async () => {
    startDownloadingTransition(async () => {
      const contentToPrint = document.getElementById('printable-preview-area');
  
      if (!contentToPrint) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not find the content to download.',
        });
        return;
      }
      
      toast({ title: 'Preparing PDF...', description: 'Please wait while we generate your document.' });
  
      try {
          const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
            import('jspdf'),
            import('html2canvas'),
          ]);

          const canvas = await html2canvas(contentToPrint, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: null,
          });
          
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
              orientation: 'p',
              unit: 'mm',
              format: 'a4',
          });
  
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfPageHeight = pdf.internal.pageSize.getHeight();
          
          const imgProps = pdf.getImageProperties(imgData);
          const totalPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          let heightLeft = totalPdfHeight;
          let position = 0;
  
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
          heightLeft -= pdfPageHeight;
  
          while (heightLeft > 0) {
            position -= pdfPageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
            heightLeft -= pdfPageHeight;
          }
          
          const filename = `${previewTarget}.pdf`;
          pdf.save(filename);
  
          toast({ title: 'Download Started!', description: `Your ${filename} is being downloaded.` });
  
      } catch (error) {
          console.error("Error generating PDF:", error);
          toast({
              variant: 'destructive',
              title: 'PDF Generation Failed',
              description: 'An unexpected error occurred. Please try again.',
          });
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

    startUploadingTransition(async () => {
      let text = '';
      try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          // @ts-ignore
          const pdfjs = await import('pdfjs-dist/build/pdf');
          // Set worker source dynamically
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items
              .map((item: any) => ('str' in item ? item.str : ''))
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

        const task = () => parseResumeAction({
          resumeText: text,
          aiConfig: form.getValues().aiConfig,
        });

        const thinkingMessages = [
          'Analyzing document structure (standard vs. separated format)...',
          'Extracting all headers and description blocks.',
          'Chronologically matching descriptions to job roles.',
          'Performing self-correction and data validation.',
          'Finalizing the structured JSON output.',
        ];

        const parsedData = await runAiTask(task, "Parsing Your Resume", thinkingMessages);

        if (!parsedData) return;

        // Safely merge the parsed data with the original data
        const finalData = {
          ...form.getValues(),
          personalInfo: {
            ...form.getValues().personalInfo, // Keep original info like photo
            ...parsedData.personalInfo,     // Overwrite with parsed text fields
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
          certifications: (parsedData.certifications || []).map((cert) => ({
            ...cert,
            id: crypto.randomUUID(),
          })),
          projects: (parsedData.projects || []).map((proj) => ({
            ...proj,
            id: crypto.randomUUID(),
          })),
        };

        // Only update summary if the parser found one
        if ('summary' in parsedData) {
          finalData.summary = parsedData.summary;
        }

        form.reset(finalData);
        toast({
          title: 'Success!',
          description: 'Your resume has been parsed and loaded into the form.',
        });
      } catch (error) {
        // Error toast is already handled by runAiTask, but we can log for debugging
        console.error("Resume parsing failed in handleFileChange:", error);
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
      setAtsResult(null); // Clear previous results

      const task = () => calculateAtsScoreAction({
        documentText,
        documentType: type,
        jobDescription,
        aiConfig,
      });

      const thinkingMessages = [
        `Starting ATS analysis for your ${type}...`,
        "Comparing your document against the job description.",
        "Analyzing keyword density and relevance.",
        "Checking for essential skills and qualifications.",
        "Evaluating formatting and structure for machine readability.",
        "Calculating the final match score.",
        "Generating actionable feedback and suggestions.",
      ];

      try {
        const result = await runAiTask(task, "Calculating ATS Score", thinkingMessages);
        if (result) {
          setAtsResult(result);
          setIsAtsModalOpen(true);
          toast({
            title: 'Success!',
            description: `Your ${type} ATS score has been calculated.`,
          });
        }
      } catch (error) {
        // Error toast is handled by runAiTask
        setAtsResult(null);
      }
    });
  };

  const handlePreviewClick = (type: 'resume' | 'cover-letter') => {
    setPreviewTarget(type);
    setIsPreviewModalOpen(true);
  };
  
  const handleSaveClick = () => {
    startSavingTransition(() => {
      try {
        const currentData = form.getValues();
        localStorage.setItem('resumeeee-data', JSON.stringify(currentData));
        toast({
          title: 'Progress Saved!',
          description: 'Your resume data has been manually saved to your browser.',
        });
      } catch (error) {
        console.error('Failed to manually save data to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: 'Could not save your data. Please try again.',
        });
      }
    });
  };

  const handleConfirmDelete = () => {
    try {
      localStorage.removeItem('resumeeee-data');
      form.reset(defaultResumeData);
      toast({
        title: 'Data Cleared',
        description: 'Your resume data has been deleted from this browser.',
      });
    } catch (error) {
      console.error('Failed to delete data from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete your data. Please try again.',
      });
    }
    setIsDeleteAlertOpen(false);
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
      <div className="grid h-screen grid-rows-[auto_1fr_auto] bg-background">
        <AppHeader
          onUploadClick={handleUploadClick}
          isUploading={isUploading}
          onCalculateAtsScore={handleCalculateAtsScore}
          isCalculatingAts={isCalculatingAts}
          isAiPowered={aiPowered}
          onPreviewClick={handlePreviewClick}
          isCoverLetterEmpty={!coverLetter}
          isDonationEnabled={isDonationEnabled}
          onAboutClick={() => setIsAboutModalOpen(true)}
          onDonateClick={() => setIsDonationModalOpen(true)}
          onSaveClick={handleSaveClick}
          isSaving={isSaving}
          onDeleteClick={() => setIsDeleteAlertOpen(true)}
        />
        <main className="overflow-hidden">
          {isDesktop ? (
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={40}>
                <ScrollArea className="h-full print:hidden">
                  <div className="p-4 sm:p-8">
                    <ResumeForm runAiTask={runAiTask} />
                  </div>
                </ScrollArea>
              </Panel>
              <PanelResizeHandle className="w-1 bg-primary/20 transition-colors hover:bg-primary/40 data-[resize-handle-state=drag]:bg-primary print:hidden" />
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full bg-muted/30 p-4 sm:p-8">
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
                  <ResumeForm runAiTask={runAiTask} />
                </TabsContent>
                <TabsContent value="preview" className="mt-4 pt-6">
                  <ResumePreview />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
        <AppFooter />
      </div>

      <Dialog open={isAtsModalOpen} onOpenChange={setIsAtsModalOpen}>
        <DialogContent className="sm:max-w-[625px] grid grid-rows-[auto_minmax(0,1fr)] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>ATS Score Checker</DialogTitle>
            <DialogDescription>
              Results of the analysis of your {atsCheckType} against the provided
              job description.
              <br />
              <span className="italic text-xs">
                Disclaimer: This is an AI simulation. Scores and feedback are
                estimates and may not reflect real-world ATS performance.
              </span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="pr-6">
            <AtsChecker
              atsResult={atsResult}
              documentType={atsCheckType}
              onAddMissingSkills={atsCheckType === 'resume' ? handleAddMissingSkills : undefined}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle>Preview: {previewTarget === 'resume' ? 'Resume' : 'Cover Letter'}</DialogTitle>
            <DialogDescription>
              This is a preview of what your document will look like.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted/30">
            <div id="printable-preview-area" className="my-8 mx-auto bg-white shadow-lg" style={{width: '210mm'}}>
              {previewTarget === 'resume' && watchedData && <SelectedTemplate data={watchedData} />}
              {previewTarget === 'cover-letter' && (
                <div className="p-6 sm:p-8">
                  {coverLetter ? (
                    <div className="whitespace-pre-wrap font-body text-sm text-gray-900">
                      {coverLetter}
                    </div>
                  ) : (
                    <div className="flex h-96 items-center justify-center text-center text-gray-500">
                      <div className="space-y-2">
                        <FileText size={48} className="mx-auto" />
                        <p>No cover letter content to preview.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="p-4 border-t bg-background">
              <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                  {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <FileDown className="mr-2 h-4 w-4" />
                  )}
                  Download PDF
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              resume and configuration data from this browser's local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className={buttonVariants({ variant: 'destructive' })}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AboutModal isOpen={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />
      <DonationModal isOpen={isDonationModalOpen} onOpenChange={setIsDonationModalOpen} />
      <AiTaskModal isOpen={isAiTaskModalOpen} title={aiTaskTitle} messages={aiTaskMessages} />
    </FormProvider>
  );
}
