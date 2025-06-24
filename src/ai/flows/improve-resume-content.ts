'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving resume content using AI suggestions.
 *
 * The flow takes resume content as input and returns AI-powered suggestions for improvement.
 * - improveResumeContent - A function that handles the resume content improvement process.
 * - ImproveResumeContentInput - The input type for the improveResumeContent function.
 * - ImproveResumeContentOutput - The return type for the improveResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {aiConfigSchema} from '@/lib/schemas';
import {z} from 'genkit';
import { getModel } from '@/ai/model-factory';

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

export async function improveResumeContent(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  return improveResumeContentFlow(input);
}

const basePromptText = `You are an AI resume expert. Provide suggestions to improve the following resume content:

Content: {{{content}}}`;

const jobDescriptionPromptText = `
Job Description: {{{jobDescription}}}

Tailor the suggestions to this job description.`;

const improveResumeContentFlow = ai.defineFlow(
  {
    name: 'improveResumeContentFlow',
    inputSchema: ImproveResumeContentInputSchema,
    outputSchema: ImproveResumeContentOutputSchema,
  },
  async input => {
    const model = getModel(input.aiConfig);

    let prompt = basePromptText.replace('{{{content}}}', input.content);
    if (input.jobDescription) {
      prompt += jobDescriptionPromptText.replace(
        '{{{jobDescription}}}',
        input.jobDescription
      );
    }
    prompt += '\n\nSuggestions:';

    const {output} = await ai.generate({
      model,
      prompt,
      output: {schema: ImproveResumeContentOutputSchema},
    });

    return output!;
  }
);
