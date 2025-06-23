'use server';

import {
  generateCoverLetter,
  type GenerateCoverLetterInput,
  type GenerateCoverLetterOutput,
} from '@/ai/flows/generate-cover-letter';
import {
  improveResumeContent,
  type ImproveResumeContentInput,
  type ImproveResumeContentOutput,
} from '@/ai/flows/improve-resume-content';
import {
  parseResume,
  type ParseResumeInput,
  type ParseResumeOutput,
} from '@/ai/flows/parse-resume';

export async function generateCoverLetterAction(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  try {
    return await generateCoverLetter(input);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter. Please try again.');
  }
}

export async function improveContentAction(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  try {
    return await improveResumeContent(input);
  } catch (error) {
    console.error('Error improving content:', error);
    throw new Error('Failed to get suggestions. Please try again.');
  }
}

export async function parseResumeAction(
  input: ParseResumeInput
): Promise<ParseResumeOutput> {
  try {
    return await parseResume(input);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(
      'Failed to parse resume. Please check the file and try again.'
    );
  }
}
