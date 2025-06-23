'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { BrainCircuit, Loader2, Plus, Trash2, Wand2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetterAction, improveContentAction } from '@/app/actions';
import { useState, useTransition, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function ResumeForm() {
  const form = useFormContext<ResumeSchema>();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isImproving, startImprovingTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<string>('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fieldToUploadTo, setFieldToUploadTo] = useState<any>(null);

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control: form.control, name: 'experience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control: form.control, name: 'education' });
  
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control: form.control, name: 'skills' });
  const [newSkill, setNewSkill] = useState('');

  const handleUploadClick = (fieldName: any) => {
    setFieldToUploadTo(fieldName);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && fieldToUploadTo) {
      if (file.type === 'text/plain') {
        try {
          const content = await file.text();
          form.setValue(fieldToUploadTo, content, { shouldValidate: true });
          toast({
            title: 'Success!',
            description: 'Content has been uploaded from the file.',
          });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error reading file',
                description: 'Could not read the content from the selected file.',
            });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a plain text (.txt) file.',
        });
      }
      setFieldToUploadTo(null);
    }
    
    if(event.target) {
        event.target.value = '';
    }
  };


  const handleGenerateCoverLetter = () => {
    startTransition(async () => {
      const { personalInfo, experience, education, skills, summary, jobDescription } = form.getValues();
      const resume = `
        Name: ${personalInfo.name}
        ${summary ? `Summary: ${summary}` : ''}
        Experience: ${experience.map(e => `${e.jobTitle} at ${e.company}: ${e.description}`).join('\n')}
        Education: ${education.map(e => `${e.degree} from ${e.institution}`).join('\n')}
        Skills: ${skills.map(s => s.name).join(', ')}
      `;

      if (!jobDescription) {
        toast({
          variant: 'destructive',
          title: 'Job Description Missing',
          description: 'Please provide a job description to generate a cover letter.',
        });
        return;
      }

      try {
        const result = await generateCoverLetterAction({ resume, jobDescription, userName: personalInfo.name });
        form.setValue('coverLetter', result.coverLetter, { shouldValidate: true });
        toast({
          title: 'Success!',
          description: 'Your AI-powered cover letter has been generated.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
      }
    });
  };

  const handleImproveContent = (fieldName: any, content: string) => {
    startImprovingTransition(async () => {
      setFieldToUpdate(fieldName);
      const { jobDescription } = form.getValues();
      try {
        const result = await improveContentAction({ content, jobDescription });
        setSuggestion(result.suggestions);
        setIsSuggestionModalOpen(true);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (error as Error).message,
        });
      }
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      appendSkill({ id: crypto.randomUUID(), name: newSkill.trim() });
      setNewSkill('');
    }
  }

  return (
    <Form {...form}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt"
        className="hidden"
      />
      <div className="space-y-8">
        <Accordion type="multiple" defaultValue={['personal', 'summary', 'experience']} className="w-full">
          <AccordionItem value="personal">
            <AccordionTrigger className="text-lg font-semibold">Personal Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="personalInfo.name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.website" render={({ field }) => (
                  <FormItem><FormLabel>Website/Portfolio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.location" render={({ field }) => (
                   <FormItem className="sm:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold">Professional Summary</AccordionTrigger>
            <AccordionContent>
                <FormField control={form.control} name="summary" render={({ field }) => (
                  <FormItem>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => handleImproveContent('summary', field.value || '')} disabled={isImproving}>
                        {isImproving && fieldToUpdate === 'summary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Improve with AI
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => handleUploadClick('summary')}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload .txt
                      </Button>
                    </div>
                  </FormItem>
                )} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold">Work Experience</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {experienceFields.map((field, index) => (
                  <Card key={field.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => (
                          <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                          <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (
                          <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                          <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                          <FormItem><FormLabel>End Date (or 'Present')</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name={`experience.${index}.description`} render={({ field: descriptionField }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea rows={5} {...descriptionField} /></FormControl>
                          <FormMessage />
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => handleImproveContent(`experience.${index}.description`, descriptionField.value || '')} disabled={isImproving}>
                              {isImproving && fieldToUpdate === `experience.${index}.description` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                              Improve with AI
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => handleUploadClick(`experience.${index}.description`)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload .txt
                            </Button>
                          </div>
                        </FormItem>
                      )} />
                    </CardContent>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendExperience({ id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-semibold">Education</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {educationFields.map((field, index) => (
                  <Card key={field.id} className="relative">
                     <CardHeader>
                      <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                          <FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                          <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => (
                          <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => (
                          <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </CardContent>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendEducation({ id: crypto.randomUUID(), degree: '', institution: '', graduationDate: '', description: '', location: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-semibold">Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="e.g. TypeScript" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                  <Button type="button" onClick={handleAddSkill}><Plus className="h-4 w-4" /> Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                      {form.watch(`skills.${index}.name`)}
                      <button type="button" onClick={() => removeSkill(index)} className="text-muted-foreground hover:text-foreground"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cover-letter">
            <AccordionTrigger className="text-lg font-semibold">AI Cover Letter Generator</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField control={form.control} name="jobDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormDescription>Paste the job description here to generate a tailored cover letter.</FormDescription>
                    <FormControl><Textarea rows={8} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="button" onClick={handleGenerateCoverLetter} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                  Generate Cover Letter
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>AI Content Suggestions</DialogTitle>
                    <DialogDescription>
                        Here are some suggestions to improve your content. You can copy and paste them into the form.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] rounded-md border p-4">
                  <pre className="whitespace-pre-wrap font-body text-sm">{suggestion}</pre>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={() => {
                      form.setValue(fieldToUpdate, suggestion, { shouldValidate: true });
                      setIsSuggestionModalOpen(false);
                      toast({ title: "Success!", description: "Content has been updated with AI suggestion."});
                    }}>Use This Suggestion</Button>
                    <Button variant="secondary" onClick={() => setIsSuggestionModalOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
