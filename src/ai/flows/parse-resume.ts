'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

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

function buildPrompt(resumeText: string): string {
    return `You are an expert resume parser. Your task is to analyze the provided resume text and extract the information.

Pay close attention to dates, job titles, company names, and educational degrees. For descriptions, capture the key responsibilities and achievements. For skills, list each skill individually.

Resume Text:
${resumeText}

Provide a response as a single, valid JSON object that conforms to the schema of the 'ParseResumeOutput' type, which includes keys for "personalInfo", "summary", "experience", "education", and "skills".
Do not include any other text, markdown, or explanations before or after the JSON object.`;
}

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  const prompt = buildPrompt(input.resumeText);

  try {
    const responseText = await callApi({ prompt, aiConfig: input.aiConfig });

    // The AI might wrap the JSON in markdown or add conversational text.
    // We'll find the start and end of the main JSON object to extract it.
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        throw new Error('Could not find a valid JSON object in the AI response.');
    }

    const jsonString = responseText.substring(startIndex, endIndex + 1);
    
    const parsedJson = JSON.parse(jsonString);
    return ParseResumeOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to parse resume JSON response:', error);
    
    // Create a more user-friendly error message based on the error type
    if (error instanceof z.ZodError) {
        // This means the JSON structure was valid, but the data didn't match our schema
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response structure was unexpected. Please check the resume file or try again.');
    } else if (error.message.includes('JSON')) {
        // This is likely a JSON.parse() error
        throw new Error('The AI returned a malformed response. Please try again.');
    }
    
    // For other errors, re-throw the original message
    throw new Error(error.message || 'An unexpected error occurred while parsing the resume.');
  }
}
