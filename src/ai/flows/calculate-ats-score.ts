'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating an ATS (Applicant Tracking System) score for a resume.
 *
 * The flow takes resume content and a job description as input and returns an ATS score and suggestions for improvement.
 * - calculateAtsScore - A function that handles the ATS score calculation process.
 * - CalculateAtsScoreInput - The input type for the calculateAtsScore function.
 * - CalculateAtsScoreOutput - The return type for the calculateAtsScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateAtsScoreInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume.'),
  jobDescription: z
    .string()
    .describe('The job description to compare the resume against.'),
});

export type CalculateAtsScoreInput = z.infer<
  typeof CalculateAtsScoreInputSchema
>;

const CalculateAtsScoreOutputSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The overall ATS score from 0 to 100, representing the match between the resume and job description.'
    ),
  keywordAnalysis: z
    .string()
    .describe(
      'An analysis of how well the resume keywords match the job description.'
    ),
  formattingFeedback: z
    .string()
    .describe(
      "Feedback on the resume's formatting, structure, and clarity from an ATS perspective."
    ),
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of key skills or qualifications from the job description that are missing from the resume.'
    ),
});

export type CalculateAtsScoreOutput = z.infer<
  typeof CalculateAtsScoreOutputSchema
>;

export async function calculateAtsScore(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  return calculateAtsScoreFlow(input);
}

const calculateAtsScorePrompt = ai.definePrompt({
  name: 'calculateAtsScorePrompt',
  input: {schema: CalculateAtsScoreInputSchema},
  output: {schema: CalculateAtsScoreOutputSchema},
  prompt: `You are an advanced Applicant Tracking System (ATS) simulator. Your task is to analyze the provided resume against the given job description and provide a detailed evaluation.

  **Instructions:**
  1.  **Calculate Score:** Assign a score from 0 to 100 based on the relevance of the resume's content (experience, skills) to the job description. A higher score means a better match.
  2.  **Keyword Analysis:** Provide a brief analysis of the resume's keyword usage. Mention if important keywords from the job description are present.
  3.  **Formatting Feedback:** Comment on the resume's structure and clarity. Is it easy for an ATS to parse? Note any potential issues like complex tables or unconventional formatting.
  4.  **Identify Missing Skills:** List the key skills, technologies, or qualifications mentioned in the job description that are absent from the resume.

  **Job Description:**
  {{{jobDescription}}}

  **Resume Text:**
  {{{resumeText}}}
`,
});

const calculateAtsScoreFlow = ai.defineFlow(
  {
    name: 'calculateAtsScoreFlow',
    inputSchema: CalculateAtsScoreInputSchema,
    outputSchema: CalculateAtsScoreOutputSchema,
  },
  async input => {
    const {output} = await calculateAtsScorePrompt(input);
    return output!;
  }
);
