import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional(),
  location: z.string().optional(),
  photo: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  graduationDate: z.string().min(1, 'Graduation date is required'),
  description: z.string().optional(),
});

const baseAiConfigSchema = z.object({
  provider: z.enum(['google', 'openai', 'openrouter']).default('google'),
  model: z.string().optional(),
});

export const donationConfigSchema = z.object({
  paypal: z.object({
    enabled: z.boolean().default(false),
    username: z.string().optional().or(z.literal('')),
  }),
  maya: z.object({
    enabled: z.boolean().default(false),
    number: z.string().optional().or(z.literal('')),
  }),
});

export const resumeSchema = z.object({
  aiPowered: z.boolean().default(false),
  aiConfig: baseAiConfigSchema.extend({
    apiKey: z.string().optional(), // Initially optional
  }),
  // Use refine to make apiKey required only when aiPowered is true

  template: z
    .enum([
      'modern',
      'classic',
      'creative',
      'minimalist',
      'professional',
      'elegant',
      'geometric',
      'technical',
    ])
    .default('modern'),
  fontStyle: z
    .enum(['inter', 'roboto', 'lato', 'merriweather'])
    .default('inter'),
  headingColor: z.string().default('#111827'),
  bodyColor: z.string().default('#374151'),
  accentColor: z.string().default('#f3f4f6'),
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.object({ id: z.string(), name: z.string() })),
  jobDescription: z.string().optional(),
  coverLetter: z.string().optional(),
  donationConfig: donationConfigSchema,
});

export const aiConfigSchema = resumeSchema.shape.aiConfig;
export type AiConfig = z.infer<typeof aiConfigSchema>;

resumeSchema.refine(
  (data) => !data.aiPowered || (data.aiPowered && data.aiConfig.apiKey),
  {
    message: 'API Key is required when AI is powered on',
    path: ['aiConfig', 'apiKey'],
  }
);
export type ResumeSchema = z.infer<typeof resumeSchema>;

export const defaultResumeData: ResumeSchema = {
  template: 'modern',
  fontStyle: 'inter',
  headingColor: '#111827',
  bodyColor: '#374151',
  accentColor: '#f3f4f6',
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    photo: '',
  },
  summary:
    'Innovative and deadline-driven Software Engineer with 5+ years of experience designing and developing user-centered digital products from initial concept to final, polished deliverable.',
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Palo Alto, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description:
        '- Led a team of 5 engineers to develop a new e-commerce platform, resulting in a 30% increase in sales.\n- Optimized application performance, reducing page load times by 40%.\n- Mentored junior engineers and conducted code reviews.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      location: 'Anytown, USA',
      graduationDate: 'May 2019',
      description: 'Graduated with honors, GPA 3.8/4.0.',
    },
  ],
  skills: [
    { id: '1', name: 'React' },
    { id: '2', name: 'Node.js' },
    { id: '3', name: 'TypeScript' },
    { id: '4', name: 'Next.js' },
    { id: '5', name: 'GraphQL' },
    { id: '6', name: 'Cloud Services (AWS, GCP)' },
  ],
  jobDescription: '',
  coverLetter: '',
  aiConfig: {
    provider: 'google',
    apiKey: '',
    model: '',
  },
  aiPowered: false,
  donationConfig: {
    paypal: {
      enabled: true,
      username: 'gehpogi',
    },
    maya: {
      enabled: true,
      number: '09625449481',
    },
  },
};
