
'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

const GenerateCoverLetterInputSchema = z.object({
  resume: z.string().describe('The resume of the user.'),
  jobDescription: z.string().describe('The job description for the role.'),
  userName: z.string().describe('The name of the user.'),
  aiConfig: aiConfigSchema,
});

export type GenerateCoverLetterInput = z.infer<
  typeof GenerateCoverLetterInputSchema
>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});

export type GenerateCoverLetterOutput = z.infer<
  typeof GenerateCoverLetterOutputSchema
>;

function buildPrompts(resume: string, jobDescription: string, userName: string): { system: string, user: string } {
  const system = `You are an expert career advisor. Based on the user's resume and the job description, generate a professional and engaging cover letter.

  **CRITICAL INSTRUCTIONS:**
  Your response MUST BE ONLY a single, valid JSON object with one key: "coverLetter". The value must be the full text of the generated cover letter as a single string. Do not include any other text, markdown, or explanations.`;
  
  const user = `
  **User Name:** ${userName}

  **Job Description:**
  ${jobDescription}

  **User's Resume:**
  ${resume}`;
  
  return { system, user };
}


export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  const prompts = buildPrompts(input.resume, input.jobDescription, input.userName);

  try {
    const responseJsonString = await callApi({ prompts, aiConfig: input.aiConfig });
    const parsedJson = JSON.parse(responseJsonString);
    return GenerateCoverLetterOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to generate or parse cover letter:', error);
     if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response did not match the expected structure for the cover letter.');
    }
    throw new Error(error.message || 'The AI returned an invalid response for the cover letter.');
  }
}
