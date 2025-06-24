'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { type ResumeSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Bot, Brush, GraduationCap, Info, Loader2, Plus, Trash2, User, Wand2, Briefcase, Star, KeyRound, Power, PowerOff, FileText, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetterAction, improveContentAction, validateApiKeyAction } from '@/app/actions';
import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { TemplateSwitcher } from '@/components/template-switcher';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const fontColors = [
  { value: '#111827', name: 'Dark Gray' },
  { value: '#1E40AF', name: 'Blue' },
  { value: '#1E8449', name: 'Green' },
  { value: '#884EA0', name: 'Purple' },
];

const fontStyles = [
  { value: 'inter', label: 'Inter (Sans-serif)' },
  { value: 'roboto', label: 'Roboto (Sans-serif)' },
  { value: 'lato', label: 'Lato (Sans-serif)' },
  { value: 'merriweather', label: 'Merriweather (Serif)' },
];

export function ResumeForm() {
  const form = useFormContext<ResumeSchema>();
  const { toast } = useToast();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isImproving, startImprovingTransition] = useTransition();
  const [isValidating, startValidationTransition] = useTransition();

  const [suggestion, setSuggestion] = useState<string>('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<any>(null);

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control: form.control, name: 'experience' });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: 'education' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: 'skills' });
  const [newSkill, setNewSkill] = useState('');

  const aiPowered = form.watch('aiPowered');
  const aiProvider = form.watch('aiConfig.provider');

  const getApiKeyHelpText = (provider: 'google' | 'openai' | 'openrouter') => {
    switch (provider) {
      case 'google':
        return (
          <div>
            <p>Get your Google AI API key from Google AI Studio.</p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Go to Google AI Studio
            </a>
          </div>
        );
      case 'openai':
        return (
          <div>
            <p>Get your OpenAI API key from your OpenAI dashboard.</p>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Go to OpenAI Dashboard
            </a>
          </div>
        );
      case 'openrouter':
        return (
          <div>
            <p>Get your OpenRouter API key from your account settings.</p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Go to OpenRouter Keys
            </a>
          </div>
        );
      default:
        return <p>Select a provider to see help.</p>;
    }
  };


  const handlePowerToggle = () => {
    if (aiPowered) {
      form.setValue('aiPowered', false);
      toast({ title: 'AI Disabled', description: 'AI features have been turned off.' });
    } else {
      startValidationTransition(async () => {
        const { aiConfig } = form.getValues();
        const result = await validateApiKeyAction(aiConfig);
        if (result.isValid) {
          form.setValue('aiPowered', true);
          toast({ title: 'AI Enabled!', description: 'Your API key is valid. AI features are now active.' });
        } else {
          toast({ variant: 'destructive', title: 'API Key Validation Failed', description: result.error || 'Please check your API key and try again.' });
        }
      });
    }
  };

  const handleGenerateCoverLetter = () => {
    startGeneratingTransition(async () => {
      const { personalInfo, experience, education, skills, summary, jobDescription, aiConfig } = form.getValues();
      const resume = `
        Name: ${personalInfo.name}
        ${summary ? `Summary: ${summary}` : ''}
        Experience: ${experience.map(e => `${e.jobTitle} at ${e.company}: ${e.description}`).join('\n')}
        Education: ${education.map(e => `${e.degree} from ${e.institution}`).join('\n')}
        Skills: ${skills.map(s => s.name).join(', ')}
      `;

      if (!jobDescription) {
        toast({ variant: 'destructive', title: 'Job Description Missing', description: 'Please provide a job description to generate a cover letter.' });
        return;
      }
      try {
        const result = await generateCoverLetterAction({ resume, jobDescription, userName: personalInfo.name, aiConfig });
        form.setValue('coverLetter', result.coverLetter, { shouldValidate: true });
        toast({ title: 'Success!', description: 'Your AI-powered cover letter has been generated.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
      }
    });
  };

  const handleImproveContent = (fieldName: any, content: string) => {
    startImprovingTransition(async () => {
      setFieldToUpdate(fieldName);
      const { jobDescription, aiConfig } = form.getValues();
      const fieldType = typeof fieldName === 'string' && fieldName.startsWith('experience.') ? 'description' : 'summary';
      try {
        const result = await improveContentAction({ content, fieldType, jobDescription, aiConfig });
        setSuggestion(result.suggestions);
        setIsSuggestionModalOpen(true);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
      }
    });
  };
  
  const handleDownloadSuggestion = () => {
    const blob = new Blob([suggestion], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-suggestion.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      appendSkill({ id: crypto.randomUUID(), name: newSkill.trim() });
      setNewSkill('');
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={['ai-tools', 'design', 'personal']} className="w-full">
          
          <AccordionItem value="ai-tools">
             <AccordionTrigger><Bot className="mr-3 text-primary" /> Power your Agent</AccordionTrigger>
             <AccordionContent>
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold flex items-center gap-2"><KeyRound/> API Configuration</h3>
                  </div>
                   <div className="space-y-4">
                        <FormField control={form.control} name="aiConfig.provider" render={({ field }) => (
                            <FormItem>
                                <FormLabel>AI Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={aiPowered}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="google">Google AI</SelectItem>
                                        <SelectItem value="openai">OpenAI</SelectItem>
                                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Select the AI provider you want to use.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                       <FormField control={form.control} name="aiConfig.apiKey" render={({ field }) => (
                         <FormItem>
                           <div className="flex items-center gap-2">
                            <FormLabel>API Key</FormLabel>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button type="button" aria-label="API key help" className="cursor-help">
                                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {getApiKeyHelpText(aiProvider)}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                           </div>
                           <FormControl><Input type="password" placeholder="Enter your API key" {...field} disabled={aiPowered} /></FormControl>
                           <FormMessage />
                         </FormItem>
                       )} />
                       <FormField control={form.control} name="aiConfig.model" render={({ field }) => (
                         <FormItem>
                           <FormLabel>Model Name (Optional)</FormLabel>
                           <FormControl><Input placeholder="e.g., gemini-1.5-flash-latest" {...field} disabled={aiPowered}/></FormControl>
                           <FormDescription>If left blank, a default model will be used.</FormDescription>
                           <FormMessage />
                         </FormItem>
                       )} />
                   </div>
                   <Separator className="my-6" />
                   <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">Provide your API key, then click the power button to validate it and enable AI features.</p>
                      <Button
                          size="icon"
                          onClick={handlePowerToggle}
                          disabled={isValidating}
                          className={cn('transition-all shrink-0',
                              aiPowered
                              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-[length:200%_200%] text-white animate-flow-glow animate-pulse-glow'
                              : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                          )}
                        >
                        {isValidating ? <Loader2 className="animate-spin" /> : aiPowered ? <Power /> : <PowerOff />}
                      </Button>
                   </div>
                </div>
             </AccordionContent>
          </AccordionItem>

          <AccordionItem value="design">
            <AccordionTrigger><Brush className="mr-3 text-primary" /> Design & Style</AccordionTrigger>
            <AccordionContent className="space-y-6">
              <TemplateSwitcher />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField control={form.control} name="fontStyle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger></FormControl><SelectContent>{fontStyles.map(font => (<SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>))}</SelectContent></Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fontColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Color</FormLabel>
                    <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-4 pt-2">{fontColors.map(color => (<FormItem key={color.value} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" /></FormControl><Label htmlFor={`color-${color.value}`} className="cursor-pointer rounded-full p-0.5 ring-offset-background has-[:checked]:ring-2 has-[:checked]:ring-primary"><div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color.value }} /><span className="sr-only">{color.name}</span></Label></FormItem>))}</RadioGroup></FormControl><FormMessage />
                  </FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal">
            <AccordionTrigger><User className="mr-3 text-primary" /> Personal Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="personalInfo.name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personalInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personalInfo.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personalInfo.website" render={({ field }) => (<FormItem><FormLabel>Website/Portfolio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="personalInfo.location" render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary">
            <AccordionTrigger><Info className="mr-3 text-primary" /> Professional Summary</AccordionTrigger>
            <AccordionContent>
              <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem>
                  <FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => handleImproveContent('summary', field.value || '')} disabled={isImproving || !aiPowered}>{isImproving && fieldToUpdate === 'summary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Improve with AI</Button>
                  </div>
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="experience">
            <AccordionTrigger><Briefcase className="mr-3 text-primary" /> Work Experience</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border border-border/50 p-4 space-y-4 bg-background/30">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => (<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>End Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name={`experience.${index}.description`} render={({ field: descField }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...descField} /></FormControl><FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center justify-between pt-2">
                        <Button 
                            type="button" 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleImproveContent(`experience.${index}.description`, form.getValues(`experience.${index}.description`) || '')} 
                            disabled={isImproving || !aiPowered}
                        >
                            {isImproving && fieldToUpdate === `experience.${index}.description` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Improve with AI
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => appendExperience({ id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="education">
            <AccordionTrigger><GraduationCap className="mr-3 text-primary" /> Education</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border border-border/50 p-4 space-y-4 bg-background/30">
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => (<FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex justify-end pt-2">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeEducation(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => appendEducation({ id: crypto.randomUUID(), degree: '', institution: '', graduationDate: '', description: '', location: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="skills">
            <AccordionTrigger><Star className="mr-3 text-primary" /> Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="e.g. TypeScript" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                  <Button type="button" onClick={handleAddSkill}><Plus className="h-4 w-4" /> Add</Button>
                </div>
                <div className="flex min-h-[2.25rem] flex-wrap gap-2 rounded-lg border border-border/50 p-3 bg-background/30">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                      <span>{form.watch(`skills.${index}.name`)}</span>
                      <button type="button" onClick={() => removeSkill(index)} className="text-secondary-foreground/70 hover:text-secondary-foreground"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cover-letter">
            <AccordionTrigger><FileText className="mr-3 text-primary" /> AI Cover Letter Generator</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField control={form.control} name="jobDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormDescription>Paste the job description here to generate a tailored cover letter and check your ATS score.</FormDescription>
                    <FormControl><Textarea rows={8} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={handleGenerateCoverLetter} disabled={isGenerating || !aiPowered}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Cover Letter
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <Dialog open={isSuggestionModalOpen} onOpenChange={setIsSuggestionModalOpen}>
            <DialogContent className="sm:max-w-[625px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>AI-Improved Content</DialogTitle>
                    <DialogDescription>
                        Here is the improved version of your content. You can use it to replace the original.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] rounded-md border p-4 bg-background/50">
                  <pre className="whitespace-pre-wrap font-body text-sm">{suggestion}</pre>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={() => {
                      form.setValue(fieldToUpdate, suggestion, { shouldValidate: true });
                      setIsSuggestionModalOpen(false);
                      toast({ title: "Success!", description: "Content has been updated with AI suggestion."});
                    }}>Use This Version</Button>
                    <Button variant="outline" onClick={handleDownloadSuggestion}>Download</Button>
                    <Button variant="secondary" onClick={() => setIsSuggestionModalOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
