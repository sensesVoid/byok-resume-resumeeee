
'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { type ResumeSchema, defaultResumeData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Bot, Brush, GraduationCap, Info, Loader2, Plus, Trash2, User, Wand2, Briefcase, Star, KeyRound, Power, PowerOff, HelpCircle, Upload, ScanSearch, Mail, Award, KanbanSquare, FileText } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';


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

interface ResumeFormProps {
  runAiTask: <T>(
    taskFn: () => Promise<T>,
    title: string,
    messages: string[]
  ) => Promise<T | null>;
}

export function ResumeForm({ runAiTask }: ResumeFormProps) {
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
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: 'projects' });
  const [newSkill, setNewSkill] = useState('');

  const aiPowered = form.watch('aiPowered');
  const aiProvider = form.watch('aiConfig.provider');
  const selectedTemplate = form.watch('template');
  const showPhotoUpload = (templatesWithPhoto as readonly string[]).includes(
    selectedTemplate
  );


  const getApiKeyHelpText = (provider: 'google' | 'openai' | 'openrouter' | 'ollama') => {
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
      case 'ollama':
        return (
          <div>
            <p>Ollama runs locally and does not require an API key.</p>
            <a
              href="https://ollama.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Learn more about Ollama
            </a>
          </div>
        );
      default:
        return <p>Select a provider to see help.</p>;
    }
  };
  
  const getModelHelpText = (provider: 'google' | 'openai' | 'openrouter' | 'ollama') => {
    switch (provider) {
      case 'google':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">Google Model Recommendations</h4>
                <p className="text-xs">
                    For a great balance of speed, cost, and intelligence, we recommend using:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gemini-1.5-flash-latest</code>
                </p>
                <p className="text-xs">
                    For maximum power and reasoning, you can use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gemini-1.5-pro-latest</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">gemini-1.5-pro-latest</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'openai':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">OpenAI Model Recommendations</h4>
                <p className="text-xs">
                    The latest and most capable model is:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-4o</code>
                </p>
                <p className="text-xs">
                    A faster and more affordable, yet still powerful option is:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-4-turbo</code>
                </p>
                 <p className="text-xs">
                    For maximum speed on simple tasks, you can use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-3.5-turbo</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">gpt-4o</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'openrouter':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">OpenRouter Model Usage</h4>
                 <p className="text-xs">
                    To let OpenRouter automatically select the best model for the job, leave this field blank or enter:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">openrouter/auto</code>
                </p>
                <p className="text-xs">
                    To use a specific model, you must provide its full identifier. You can find a list on the OpenRouter website. Popular choices include:
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">anthropic/claude-3-haiku</code>
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">google/gemini-flash-1.5</code>
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">mistralai/mistral-large</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">anthropic/claude-3.5-sonnet</code> or <code className="text-xs">google/gemini-1.5-pro</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'ollama':
        return (
            <div className="p-2 text-left max-w-md space-y-3">
                <h4 className="font-bold">Comprehensive Guide to Ollama Models</h4>
                <p className="text-xs">
                   Ollama lets you run powerful AI models on your own computer for free. Before using a model, you must download it first. Here’s how:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-xs">
                    <li>
                        <strong>Open Your Computer's Terminal</strong>
                        <p className="pl-4 text-muted-foreground">
                            - On **macOS**: Search for the "Terminal" app using Spotlight (Cmd+Space).<br />
                            - On **Windows**: Search for "PowerShell" in the Start Menu.
                        </p>
                    </li>
                    <li>
                        <strong>Choose and Download a Model</strong>
                         <p className="pl-4 text-muted-foreground">
                            Copy one of the commands below and paste it into your terminal, then press Enter. The first download might take several minutes.
                        </p>
                        <div className="pl-4 space-y-2 pt-1">
                            <p className="font-semibold text-foreground">Recommended General Models:</p>
                            <code className="block w-full bg-muted p-1.5 rounded-md text-foreground">ollama run llama3</code>
                            <code className="block w-full bg-muted p-1.5 rounded-md text-foreground">ollama run mistral</code>
                            
                            <p className="font-semibold text-foreground pt-2">For Coding Tasks:</p>
                            <code className="block w-full bg-muted p-1.5 rounded-md text-foreground">ollama run codellama</code>

                            <p className="font-semibold text-foreground pt-2">Lighter & Faster Models:</p>
                            <code className="block w-full bg-muted p-1.5 rounded-md text-foreground">ollama run gemma</code>
                        </div>
                    </li>
                    <li>
                        <strong>Use the Model in This App</strong>
                         <p className="pl-4 text-muted-foreground">
                           {'After the download is complete and you see a prompt like `>>> Send a message`, the model is ready. Come back here and type its name (e.g., `llama3`) into the "Model Name" field.'}
                        </p>
                    </li>
                </ol>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, larger models (like <code className="text-xs">llama3:70b</code> or <code className="text-xs">mixtral</code>) are recommended as they can process more of your document at once, but they require more computer resources.
                </p>
            </div>
        );
      default:
        return <p>Select a provider to see model recommendations.</p>;
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
      
      const task = () => generateCoverLetterAction({ resume, jobDescription, userName: personalInfo.name, aiConfig });
        
      const thinkingMessages = [
          "Analyzing your resume and the job description...",
          "Identifying key skills and experiences that align with the role.",
          "Crafting an engaging opening paragraph to grab the reader's attention.",
          "Highlighting your most relevant achievements and qualifications.",
          "Structuring the letter with a professional tone.",
          "Writing a strong closing statement and call to action.",
          "Proofreading and polishing the final draft.",
      ];

      try {
        const result = await runAiTask(task, "Generating Cover Letter", thinkingMessages);
        if (result) {
          form.setValue('coverLetter', result.coverLetter, { shouldValidate: true });
          toast({ title: 'Success!', description: 'Your AI-powered cover letter has been generated.' });
        }
      } catch (error) {
        // Error is handled by runAiTask
      }
    });
  };

  const handleImproveContent = (fieldName: any, content: string) => {
    startImprovingTransition(async () => {
      setFieldToUpdate(fieldName);
      const { jobDescription, aiConfig } = form.getValues();
      const fieldType = typeof fieldName === 'string' && fieldName.startsWith('experience.') ? 'description' : 'summary';
      
      const task = () => improveContentAction({ content, fieldType, jobDescription, aiConfig });

      const thinkingMessages = [
        "Analyzing your original content...",
        `Rewriting for impact and clarity as a ${fieldType}.`,
        "Incorporating strong action verbs.",
        jobDescription ? "Tailoring the content to the job description." : "Optimizing for general professional appeal.",
        "Ensuring the tone is professional and concise.",
        "Finalizing suggestions...",
      ];

      try {
        const result = await runAiTask(task, "Improving Content", thinkingMessages);
        if (result) {
          setSuggestion(result.suggestions);
          setIsSuggestionModalOpen(true);
        }
      } catch (error) {
        // Error is handled by runAiTask
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
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <Bot className="h-6 w-6 text-primary"/>
                AI Toolkit
            </h2>
            <Accordion type="multiple" defaultValue={['ai-tools']} className="w-full">
                <AccordionItem value="ai-tools">
                    <AccordionTrigger data-powered={aiPowered}>
                        <div className="flex items-center"><KeyRound className={cn("mr-3", aiPowered ? "text-primary" : "text-destructive")} /> Power your Agent</div>
                    </AccordionTrigger>
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
                                                <SelectItem value="ollama">Ollama (Local)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select the AI provider you want to use.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            
                            {aiProvider !== 'ollama' && (
                                <FormField control={form.control} name="aiConfig.apiKey" render={({ field }) => (
                                    <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormLabel>API Key</FormLabel>
                                        <TooltipProvider>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button type="button" aria-label="API key help" className="cursor-help">
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent side="right" className="w-80">
                                                    {getApiKeyHelpText(aiProvider)}
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipProvider>
                                    </div>
                                    <FormControl><Input type="password" placeholder="Enter your API key" {...field} disabled={aiPowered} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                            )}
                            
                            {aiProvider === 'ollama' && (
                                <FormField control={form.control} name="aiConfig.ollamaHost" render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-2">
                                            <FormLabel>Ollama Host URL</FormLabel>
                                            <TooltipProvider>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button type="button" aria-label="Ollama setup help" className="cursor-help">
                                                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent side="right" className="max-w-md w-screen">
                                                        <div className="space-y-3 p-2 text-left">
                                                            <h4 className="font-bold">How to Use Ollama (Local AI)</h4>
                                                            <p className="text-xs">
                                                                Ollama lets you run powerful AI models on your own computer, for free and with complete privacy.
                                                            </p>
                                                            <ol className="list-decimal list-inside space-y-3 text-xs">
                                                                <li>
                                                                    <strong>Install Ollama:</strong> Download and install the application from{" "}
                                                                    <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-primary underline">ollama.com/download</a>. Make sure it is running.
                                                                </li>
                                                                <li>
                                                                    <strong>For Local Use:</strong> If you are running this app on the same computer as Ollama, use the default URL:
                                                                    <br/>
                                                                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">http://localhost:11434</code>
                                                                </li>
                                                                <li className="font-bold">
                                                                    For Deployed App Use (e.g., resumeeee.pro)
                                                                    <p className="font-normal mt-1">To connect this deployed site to your local Ollama, you must securely expose Ollama to the internet.</p>
                                                                    
                                                                    <p className="font-normal mt-2"><strong>Step 1: Start Ollama with Specific Permissions</strong></p>
                                                                    <p className="font-normal mt-1 text-muted-foreground">
                                                                        This is the most important step. Open your terminal and run the command below. It tells Ollama to accept connections from your deployed website (`resumeeee.pro`) and from ngrok, which is more secure than allowing all connections.
                                                                    </p>
                                                                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS='https://resumeeee.pro,https://*.ngrok-free.app' ollama serve</code>
                                                                    <p className="font-normal mt-1 text-muted-foreground">Keep this terminal window open. If you close it, the connection will stop.</p>
                                                                    
                                                                    <p className="font-normal mt-2"><strong>Step 2: Expose Ollama with ngrok</strong></p>
                                                                    <p className="font-normal mt-1 text-muted-foreground">In a <strong>new, separate</strong> terminal window, run this command to create a public URL for Ollama:</p>
                                                                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">ngrok http 11434</code>
                                                                    
                                                                    <p className="font-normal mt-2"><strong>Step 3: Use the ngrok URL Here</strong></p>
                                                                    <p className="font-normal mt-1 text-muted-foreground">Copy the `https://...ngrok-free.app` URL from your ngrok terminal and paste it into the "Ollama Host URL" field in this app.</p>
                                                                </li>
                                                            </ol>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl><Input placeholder="http://localhost:11434" {...field} value={field.value ?? ''} disabled={aiPowered} /></FormControl>
                                        <FormDescription>The URL of your running Ollama server. Visiting this URL in a browser may show a blank page; this is normal.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                            <FormField control={form.control} name="aiConfig.model" render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormLabel>Model Name (Optional)</FormLabel>
                                    <TooltipProvider>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button type="button" aria-label="Model help" className="cursor-help">
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent side="right" className="max-w-md w-screen">
                                                {getModelHelpText(aiProvider)}
                                            </PopoverContent>
                                        </Popover>
                                    </TooltipProvider>
                                </div>
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

                <AccordionItem value="ats-tools">
                    <AccordionTrigger data-powered={aiPowered}>
                        <div className="flex items-center"><ScanSearch className={cn("mr-3", aiPowered ? "text-primary" : "text-destructive")} /> ATS & Job Matching</div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-4">
                        <FormField control={form.control} name="jobDescription" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormDescription>Paste the job description here to check your ATS score and generate a tailored cover letter.</FormDescription>
                            <FormControl><Textarea rows={8} {...field} disabled={!aiPowered} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cover-letter-generator">
                    <AccordionTrigger data-powered={aiPowered}>
                        <div className="flex items-center"><Mail className={cn("mr-3", aiPowered ? "text-primary" : "text-destructive")} /> AI Cover Letter Generator</div>
                    </AccordionTrigger>
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
                        <p className="text-xs text-muted-foreground pt-2">
                            Disclaimer: The output of this tool is based on an AI model and may not be perfect. Always review and edit the generated content to best fit your personal style and the job you are applying for.
                        </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary"/>
                Resume Builder
            </h2>
            <Accordion type="multiple" defaultValue={['design', 'personal']} className="w-full">
                <AccordionItem value="design">
                    <AccordionTrigger>
                        <div className="flex items-center"><Brush className="mr-3 text-primary" /> Design & Style</div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
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
                    <AccordionTrigger>
                        <div className="flex items-center"><User className="mr-3 text-primary" /> Personal Information</div>
                    </AccordionTrigger>
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
                    <AccordionTrigger>
                        <div className="flex items-center"><Info className="mr-3 text-primary" /> Professional Summary</div>
                    </AccordionTrigger>
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
                    <AccordionTrigger>
                        <div className="flex items-center"><Briefcase className="mr-3 text-primary" /> Work Experience</div>
                    </AccordionTrigger>
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
                                <div className="flex items-center justify-between pt-2">
                                    <Button 
                                        type="button" 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleImproveContent(`experience.${index}.description`, descField.value || '')} 
                                        disabled={isImproving || !aiPowered}
                                    >
                                        {isImproving && fieldToUpdate === `experience.${index}.description` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Improve with AI
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)} aria-label="Remove experience entry">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </FormItem>
                            )} />
                        </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={() => appendExperience({ id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                    </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="education">
                    <AccordionTrigger>
                        <div className="flex items-center"><GraduationCap className="mr-3 text-primary" /> Education</div>
                    </AccordionTrigger>
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
                    <AccordionTrigger>
                        <div className="flex items-center"><Star className="mr-3 text-primary" /> Skills</div>
                    </AccordionTrigger>
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
                    <AccordionTrigger>
                        <div className="flex items-center"><Award className="mr-3 text-primary" /> Certifications (Optional)</div>
                    </AccordionTrigger>
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

                <AccordionItem value="projects">
                    <AccordionTrigger>
                        <div className="flex items-center"><KanbanSquare className="mr-3 text-primary" /> Projects (Optional)</div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <div className="space-y-6 pt-4">
                        {projectFields.map((field, index) => (
                        <div key={field.id} className="rounded-lg border border-border/50 p-4 space-y-4 bg-background/30">
                            <div className="grid grid-cols-1 gap-4">
                            <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`projects.${index}.link`} render={({ field }) => (<FormItem><FormLabel>Project Link</FormLabel><FormControl><Input placeholder="https://github.com/user/repo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="flex justify-end pt-2">
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeProject(index)} aria-label="Remove project entry">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={() => appendProject({ id: crypto.randomUUID(), name: '', description: '', link: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                    </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

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
                <p className="text-xs text-muted-foreground text-center px-4 pt-2">
                    Disclaimer: AI-generated content can sometimes be inaccurate. Please review it carefully.
                </p>
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
      </form>
    </Form>
  );
}
