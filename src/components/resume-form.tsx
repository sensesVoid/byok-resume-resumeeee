
'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { type ResumeSchema, defaultResumeData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Bot, Brush, GraduationCap, Info, Loader2, Plus, Trash2, User, Wand2, Briefcase, Star, KeyRound, Power, PowerOff, HelpCircle, Upload, ScanSearch, Mail, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetterAction, improveContentAction, validateApiKeyAction } from '@/app/actions';
import { useState, useTransition, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { TemplateSwitcher, templatesWithPhoto } from '@/components/template-switcher';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from './ui/switch';
import { Label } from '@/components/ui/label';


const fontStyles = [
  { value: 'inter', label: 'Inter (Sans-serif)' },
  { value: 'roboto', label: 'Roboto (Sans-serif)' },
  { value: 'lato', label: 'Lato (Sans-serif)' },
  { value: 'montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'source-sans-pro', label: 'Source Sans Pro (Sans-serif)' },
  { value: 'merriweather', label: 'Merriweather (Serif)' },
  { value: 'roboto-slab', label: 'Roboto Slab (Serif)' },
  { value: 'playfair-display', label: 'Playfair Display (Serif)' },
];

export function ResumeForm() {
  const form = useFormContext<ResumeSchema>();
  const { toast } = useToast();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isImproving, startImprovingTransition] = useTransition();
  const [isValidating, startValidationTransition] = useTransition();
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<any>(null);

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control: form.control, name: 'experience' });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: 'education' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: 'skills' });
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({ control: form.control, name: 'certifications' });
  const [newSkill, setNewSkill] = useState('');

  const aiPowered = form.watch('aiPowered');
  const aiProvider = form.watch('aiConfig.provider');
  const selectedTemplate = form.watch('template');
  const showPhotoUpload = (templatesWithPhoto as readonly string[]).includes(
    selectedTemplate
  );


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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload an image file (e.g., PNG, JPG).',
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
            toast({
                variant: 'destructive',
                title: 'Error Reading File',
                description: 'Could not read the selected file.',
            });
            return;
        }
        form.setValue('personalInfo.photo', dataUrl, { shouldValidate: true });
        toast({
            title: 'Photo Uploaded!',
            description: 'Your photo has been added to the resume.',
        });
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error reading file',
            description: 'Could not read the content from the selected file.',
        });
    };
    reader.readAsDataURL(file);

    if (event.target) {
        event.target.value = '';
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
      
      if (!jobDescription) {
        toast({ 
            variant: 'destructive', 
            title: 'Job Description Missing', 
            description: 'Please add a job description in the "ATS & Job Matching" section first.' 
        });
        return;
      }
      
      const resume = `
        Name: ${personalInfo.name}
        ${summary ? `Summary: ${summary}` : ''}
        Experience: ${experience.map(e => `${e.jobTitle} at ${e.company}: ${e.description}`).join('\n')}
        Education: ${education.map(e => `${e.degree} from ${e.institution}`).join('\n')}
        Skills: ${skills.map(s => s.name).join(', ')}
      `;

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
  };

  const handleClearPersonalInfo = () => {
    form.setValue('personalInfo', {
      name: '',
      email: '',
      phone: '',
      website: '',
      location: '',
      photo: '',
    }, { shouldValidate: true });
    toast({ title: 'Personal info cleared.' });
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={['ai-tools', 'design', 'personal', 'ats-tools']} className="w-full">
          
          <AccordionItem value="ai-tools">
             <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Bot className="mr-3 text-primary" /> Power your Agent</h2></AccordionTrigger>
             <AccordionContent>
                <div className="pt-4">
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
                          aria-label={aiPowered ? 'Disable AI Features' : 'Enable AI Features'}
                          className={cn('transition-all shrink-0',
                              aiPowered
                              ? 'bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-[length:200%_200%] text-white animate-flow-glow animate-pulse-glow'
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
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Brush className="mr-3 text-primary" /> Design & Style</h2></AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <TemplateSwitcher />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField control={form.control} name="fontStyle" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger></FormControl><SelectContent>{fontStyles.map(font => (<SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>))}</SelectContent></Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="headingColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading Color</FormLabel>
                    <FormControl>
                        <div className="relative h-10 w-full rounded-md border border-input">
                            <input
                                type="color"
                                {...field}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="h-full w-full rounded-[inherit]" style={{ backgroundColor: field.value }}></div>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="bodyColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Text Color</FormLabel>
                    <FormControl>
                        <div className="relative h-10 w-full rounded-md border border-input">
                             <input
                                type="color"
                                {...field}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="h-full w-full rounded-[inherit]" style={{ backgroundColor: field.value }}></div>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="accentColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <FormControl>
                        <div className="relative h-10 w-full rounded-md border border-input">
                            <input
                                type="color"
                                {...field}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="h-full w-full rounded-[inherit]" style={{ backgroundColor: field.value }}></div>
                        </div>
                    </FormControl>
                    <FormDescription>For sidebars or headers.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><User className="mr-3 text-primary" /> Personal Information</h2></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                 {showPhotoUpload && (
                    <>
                        <FormField
                            control={form.control}
                            name="personalInfo.photo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Photo</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={field.value || undefined} alt="User Photo" />
                                            <AvatarFallback>
                                                <User className="h-10 w-10 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                                                <Upload className="mr-2 h-4 w-4" /> Upload
                                            </Button>
                                            {field.value && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label="Remove photo"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => form.setValue('personalInfo.photo', '', { shouldValidate: true })}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <input
                                type="file"
                                ref={photoInputRef}
                                onChange={handlePhotoUpload}
                                accept="image/png, image/jpeg"
                                className="hidden"
                            />
                    </>
                 )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={form.control} name="personalInfo.name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="personalInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="personalInfo.phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="personalInfo.website" render={({ field }) => (<FormItem><FormLabel>Website/Portfolio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="personalInfo.location" render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="flex justify-end pt-2">
                   <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={handleClearPersonalInfo} aria-label="Clear all personal information">
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Info className="mr-3 text-primary" /> Professional Summary</h2></AccordionTrigger>
            <AccordionContent>
              <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem className="pt-4">
                  <FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage />
                   <div className="flex items-center justify-between pt-2">
                      <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleImproveContent('summary', field.value || '')} 
                          disabled={isImproving || !aiPowered}
                      >
                          {isImproving && fieldToUpdate === 'summary' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Improve with AI
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive" 
                        onClick={() => form.setValue('summary', '', { shouldValidate: true })}
                        aria-label="Clear summary"
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="experience">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Briefcase className="mr-3 text-primary" /> Work Experience</h2></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
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
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)} aria-label="Remove experience entry">
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
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><GraduationCap className="mr-3 text-primary" /> Education</h2></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
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
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeEducation(index)} aria-label="Remove education entry">
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
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Star className="mr-3 text-primary" /> Skills</h2></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-skill-input">Add a skill</Label>
                  <div className="flex gap-2">
                    <Input id="new-skill-input" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="e.g. TypeScript" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                    <Button type="button" onClick={handleAddSkill}><Plus className="mr-2 h-4 w-4" /> Add</Button>
                  </div>
                </div>
                <div className="flex min-h-[2.25rem] flex-wrap gap-2 rounded-lg border border-border/50 p-3 bg-background/30">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                      <span>{form.watch(`skills.${index}.name`)}</span>
                      <button type="button" onClick={() => removeSkill(index)} className="text-secondary-foreground/70 hover:text-secondary-foreground" aria-label={`Remove skill: ${form.watch(`skills.${index}.name`)}`}><Trash2 className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="certifications">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Award className="mr-3 text-primary" /> Certifications (Optional)</h2></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
                {certificationFields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border border-border/50 p-4 space-y-4 bg-background/30">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name={`certifications.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`certifications.${index}.issuer`} render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name={`certifications.${index}.date`} render={({ field }) => (<FormItem><FormLabel>Date Issued</FormLabel><FormControl><Input placeholder="e.g., June 2023" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex justify-end pt-2">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeCertification(index)} aria-label="Remove certification entry">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => appendCertification({ id: crypto.randomUUID(), name: '', issuer: '', date: '' })}><Plus className="mr-2 h-4 w-4" /> Add Certification</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ats-tools">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><ScanSearch className="mr-3 text-primary" /> ATS & Job Matching</h2></AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 pt-4">
                <FormField control={form.control} name="jobDescription" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormDescription>Paste the job description here to check your ATS score and generate a tailored cover letter.</FormDescription>
                    <FormControl><Textarea rows={8} {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cover-letter-generator">
            <AccordionTrigger><h2 className="text-lg font-semibold flex items-center"><Mail className="mr-3 text-primary" /> AI Cover Letter Generator</h2></AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                    Make sure you've added a job description in the "ATS & Job Matching" section above before generating a cover letter.
                </p>
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
