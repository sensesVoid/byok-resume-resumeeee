'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

const CalculateAtsScoreInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume.'),
  jobDescription: z
    .string()
    .describe('The job description to compare the resume against.'),
  aiConfig: aiConfigSchema,
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

function buildPrompt(resumeText: string, jobDescription: string): string {
  return `You are an advanced Applicant Tracking System (ATS) simulator. Your task is to analyze the provided resume against the given job description and provide a detailed evaluation.

  **Job Description:**
  ${jobDescription}

  **Resume Text:**
  ${resumeText}
  
  Provide a response as a single, valid JSON object with the following keys: "score", "keywordAnalysis", "formattingFeedback", "missingSkills".
  - "score": A number from 0 to 100.
  - "keywordAnalysis": A string analyzing keyword match.
  - "formattingFeedback": A string providing feedback on formatting.
  - "missingSkills": An array of strings listing missing skills.
  
  Do not include any other text, markdown, or explanations before or after the JSON object.`;
}

export async function calculateAtsScore(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  const prompt = buildPrompt(input.resumeText, input.jobDescription);
  
  try {
    const responseJsonString = await callApi({ prompt, aiConfig: input.aiConfig });
    const parsedJson = JSON.parse(responseJsonString);
    return CalculateAtsScoreOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to calculate or parse ATS score:', error);
    throw new Error(error.message || 'The AI returned an invalid response for the ATS score.');
  }
}
