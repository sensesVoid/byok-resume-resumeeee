'use server';

import { aiConfigSchema } from '@/lib/schemas';
import { z } from 'zod';
import { callApi } from '@/ai/api-caller';

const ImproveResumeContentInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the resume or cover letter to be improved.'),
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
    .describe('AI-powered suggestions for improving the resume content.'),
});

export type ImproveResumeContentOutput = z.infer<
  typeof ImproveResumeContentOutputSchema
>;


function buildPrompt(content: string, jobDescription?: string): string {
  const basePrompt = `You are an AI resume expert. Provide suggestions to improve the following resume content.

Content: ${content}`;

  const jobDescPrompt = jobDescription
    ? `\n\nTailor the suggestions to this job description:\n${jobDescription}`
    : '';
  
  const formatInstruction = `\n\nProvide a response as a single, valid JSON object with one key: "suggestions". The value should be the full text of your suggestions as a single string, using markdown for formatting (like bullet points).
Do not include any other text or explanations before or after the JSON object.`;

  return basePrompt + jobDescPrompt + formatInstruction;
}


export async function improveResumeContent(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  const prompt = buildPrompt(input.content, input.jobDescription);

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
