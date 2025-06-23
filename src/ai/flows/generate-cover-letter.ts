// src/ai/flows/generate-cover-letter.ts
'use server';

/**
 * @fileOverview Generates a cover letter based on a resume and job description.
 *
 * - generateCoverLetter - A function that generates a cover letter.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resume: z
    .string()
    .describe('The resume of the user.'),
  jobDescription: z.string().describe('The job description for the role.'),
  userName: z.string().describe('The name of the user.'),
});

export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});

export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const generateCoverLetterPrompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career advisor.

  Based on the user's resume and the job description, generate a cover letter for the user.
  The cover letter should be tailored to the job description and highlight the user's relevant skills and experience.
  The cover letter should be professional and engaging.
  The cover letter should be addressed to the hiring manager or the company.
  The cover letter should include a call to action.

  Resume: {{{resume}}}
  Job Description: {{{jobDescription}}}
  User Name: {{{userName}}}

  Cover Letter:`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await generateCoverLetterPrompt(input);
    return output!;
  }
);
