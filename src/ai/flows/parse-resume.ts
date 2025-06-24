'use server';
/**
 * @fileOverview Parses resume text into a structured JSON format.
 *
 * - parseResume - A function that parses resume text.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {aiConfigSchema} from '@/lib/schemas';
import {z} from 'genkit';

// Schemas for what the AI should output. These omit IDs.
const ParsedPersonalInfoSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  email: z.string().email().describe('The email address.'),
  phone: z.string().optional().describe('The phone number.'),
  website: z.string().url().optional().describe('The personal website or portfolio URL.'),
  location: z.string().optional().describe('The city and state, e.g., "San Francisco, CA".'),
});

const ParsedExperienceSchema = z.object({
  jobTitle: z.string().describe('The job title.'),
  company: z.string().describe('The company name.'),
  location: z.string().optional().describe('The location of the company.'),
  startDate: z.string().describe('The start date of the employment.'),
  endDate: z.string().optional().describe("The end date of the employment (or 'Present')."),
  description: z.string().optional().describe('A description of the responsibilities and achievements.'),
});

const ParsedEducationSchema = z.object({
  degree: z.string().describe('The degree or certificate obtained.'),
  institution: z.string().describe('The name of the institution.'),
  location: z.string().optional().describe('The location of the institution.'),
  graduationDate: z.string().describe('The graduation date.'),
  description: z.string().optional().describe('Any additional details, like GPA or honors.'),
});

const ParsedSkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
});

// The final output schema for the flow
const ParseResumeOutputSchema = z.object({
  personalInfo: ParsedPersonalInfoSchema,
  summary: z.string().optional().describe('A professional summary about the person.'),
  experience: z.array(ParsedExperienceSchema).describe('A list of work experiences.'),
  education: z.array(ParsedEducationSchema).describe('A list of educational qualifications.'),
  skills: z.array(ParsedSkillSchema).describe('A list of skills.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

// Input schema for the flow
const ParseResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The full text content of the resume to be parsed.'),
  aiConfig: aiConfigSchema,
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const promptText = `You are an expert resume parser. Your task is to analyze the provided resume text and extract the information into a structured JSON format.

Pay close attention to dates, job titles, company names, and educational degrees. For descriptions, capture the key responsibilities and achievements. For skills, list each skill individually.

Resume Text:
{{{resumeText}}}
`;

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {provider, apiKey, model: modelName} = input.aiConfig;
    if (provider !== 'Google AI') {
      throw new Error('Only the Google AI provider is supported at this time.');
    }
    if (!apiKey) {
      throw new Error('An API key is required for the selected provider.');
    }
    const model = googleAI({apiKey}).model(modelName || 'gemini-2.0-flash');

    const prompt = promptText.replace('{{{resumeText}}}', input.resumeText);

    const {output} = await ai.generate({
      model,
      prompt,
      output: {schema: ParseResumeOutputSchema},
    });

    return output!;
  }
);