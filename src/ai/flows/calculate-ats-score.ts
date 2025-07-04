
'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

const CalculateAtsScoreInputSchema = z.object({
  documentText: z
    .string()
    .describe('The full text content of the document (resume or cover letter).'),
  documentType: z
    .enum(['resume', 'cover-letter'])
    .describe('The type of document being analyzed.'),
  jobDescription: z
    .string()
    .describe('The job description to compare the document against.'),
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
      'The overall ATS score from 0 to 100, representing the match between the document and job description.'
    ),
  keywordAnalysis: z
    .string()
    .describe(
      'An analysis of how well the document keywords match the job description.'
    ),
  formattingFeedback: z
    .string()
    .describe(
      "Feedback on the document's formatting, structure, and clarity from an ATS perspective."
    ),
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of key skills or qualifications from the job description that are missing from the document.'
    ),
});

export type CalculateAtsScoreOutput = z.infer<
  typeof CalculateAtsScoreOutputSchema
>;

function buildPrompts(
  documentText: string,
  jobDescription: string,
  documentType: 'resume' | 'cover-letter'
): { system: string; user: string } {
  const documentName = documentType === 'resume' ? 'Resume' : 'Cover Letter';
  const system = `You are an advanced Applicant Tracking System (ATS) simulator. Your task is to analyze the provided ${documentName.toLowerCase()} against the given job description and provide a detailed evaluation.

  **CRITICAL INSTRUCTIONS:**
  Your response MUST BE ONLY a single, valid JSON object with the following keys: "score", "keywordAnalysis", "formattingFeedback", "missingSkills".
  - "score": A number from 0 to 100.
  - "keywordAnalysis": A string analyzing keyword match.
  - "formattingFeedback": A string providing feedback on formatting.
  - "missingSkills": An array of strings listing missing skills.
  
  Do not include any other text, markdown, or explanations before or after the JSON object.`;
  
  const user = `
  **Job Description:**
  ${jobDescription}

  **${documentName} Text:**
  ${documentText}`;
  
  return { system, user };
}


export async function calculateAtsScore(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  const prompts = buildPrompts(
    input.documentText,
    input.jobDescription,
    input.documentType
  );
  
  try {
    const responseJsonString = await callApi({ prompts, aiConfig: input.aiConfig });
    const parsedJson = JSON.parse(responseJsonString);
    return CalculateAtsScoreOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to calculate or parse ATS score:', error);
    if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response did not match the expected structure for the ATS score.');
    }
    throw new Error(error.message || 'The AI returned an invalid response for the ATS score.');
  }
}
