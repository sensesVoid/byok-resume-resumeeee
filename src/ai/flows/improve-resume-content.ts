'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

const ImproveResumeContentInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the resume or cover letter to be improved.'),
  fieldType: z.enum(['summary', 'description']).describe('The type of field being improved, e.g., a paragraph summary or a list of bullet points for a job description.'),
  jobDescription: z
    .string()
    .optional()
    .describe('Optional job description to tailor the content to.'),
  aiConfig: aiConfigSchema,
});

export type ImproveResumeContentInput = z.infer<
  typeof ImproveResumeContentInputSchema
>;

const ImproveResumeContentOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('The rewritten and improved resume content.'),
});

export type ImproveResumeContentOutput = z.infer<
  typeof ImproveResumeContentOutputSchema
>;


function buildPrompt(content: string, fieldType: 'summary' | 'description', jobDescription?: string): string {
  const basePrompt = `You are an expert resume writer. Your task is to rewrite and improve the provided resume content. Make it more professional, impactful, and concise. Use strong action verbs and quantify achievements where possible.

Original Content:
${content}`;

  const jobDescPrompt = jobDescription
    ? `\n\nTailor the rewritten content to this job description:\n${jobDescription}`
    : '';
  
  const formatStyle = fieldType === 'summary'
    ? 'The rewritten content should be a single, cohesive paragraph. Do not use bullet points or multiple paragraphs.'
    : 'The rewritten content should be a series of bullet points. Each bullet point should start on a new line with a hyphen and a space (e.g., "- Achieved X...").';

  const formatInstruction = `\n\n${formatStyle}\n\nProvide a response as a single, valid JSON object with one key: "suggestions". The value should be ONLY the rewritten, improved content as a single string. Do not add any extra explanations, introductory phrases, or markdown formatting.`;

  return basePrompt + jobDescPrompt + formatInstruction;
}


export async function improveResumeContent(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  const prompt = buildPrompt(input.content, input.fieldType, input.jobDescription);

  try {
    // The callApi function now directly returns the JSON string from the AI
    const responseJsonString = await callApi({ prompt, aiConfig: input.aiConfig });
    // We just need to parse it
    const parsedJson = JSON.parse(responseJsonString);
    return ImproveResumeContentOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to get or parse content suggestions:', error);
    throw new Error(error.message || 'The AI returned an invalid response for content suggestions.');
  }
}
