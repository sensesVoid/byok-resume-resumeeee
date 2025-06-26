
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


function buildPrompts(content: string, fieldType: 'summary' | 'description', jobDescription?: string): { system: string, user: string } {
  const formatStyle = fieldType === 'summary'
    ? 'The rewritten content should be a single, cohesive paragraph. Do not use bullet points or multiple paragraphs.'
    : 'The rewritten content should be a series of bullet points. Each bullet point should start on a new line with a hyphen and a space (e.g., "- Achieved X...").';

  const system = `You are an expert resume writer. Your task is to rewrite and improve the provided resume content. Make it more professional, impactful, and concise. Use strong action verbs and quantify achievements where possible.

  **CRITICAL INSTRUCTIONS:**
  ${formatStyle}

  Your response MUST BE ONLY a single, valid JSON object with one key: "suggestions". The value should be ONLY the rewritten, improved content as a single string. Do not add any extra explanations, introductory phrases, or markdown formatting.`;

  const user = `Original Content:
${content}
${jobDescription ? `\n\nTailor the rewritten content to this job description:\n${jobDescription}` : ''}`;

  return { system, user };
}


export async function improveResumeContent(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  const prompts = buildPrompts(input.content, input.fieldType, input.jobDescription);

  try {
    const responseJsonString = await callApi({ prompts, aiConfig: input.aiConfig });
    const parsedJson = JSON.parse(responseJsonString);
    return ImproveResumeContentOutputSchema.parse(parsedJson);
  } catch (error: any) {
    console.error('Failed to get or parse content suggestions:', error);
    if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        throw new Error('The AI response did not match the expected structure for content suggestions.');
    }
    throw new Error(error.message || 'The AI returned an invalid response for content suggestions.');
  }
}
