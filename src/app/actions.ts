
'use server';

import {
  calculateAtsScore,
  type CalculateAtsScoreInput,
  type CalculateAtsScoreOutput,
} from '@/ai/flows/calculate-ats-score';
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
import {
  validateApiKey,
  type ValidateApiKeyOutput,
} from '@/ai/flows/validate-api-key';
import type { AiConfig } from '@/lib/schemas';

// Higher-order function to handle errors for AI actions
async function handleAction<T, R>(
  actionFn: (input: T) => Promise<R>,
  input: T,
  errorMessage: string
): Promise<R> {
  try {
    return await actionFn(input);
  } catch (error) {
    console.error(`Error in ${actionFn.name}:`, error);
    throw new Error((error as Error).message || errorMessage);
  }
}

export async function calculateAtsScoreAction(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  return handleAction(
    calculateAtsScore,
    input,
    'Failed to calculate ATS score. Please try again.'
  );
}

export async function generateCoverLetterAction(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  return handleAction(
    generateCoverLetter,
    input,
    'Failed to generate cover letter. Please try again.'
  );
}

export async function improveContentAction(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  return handleAction(
    improveResumeContent,
    input,
    'Failed to get suggestions. Please try again.'
  );
}

export async function parseResumeAction(
  input: ParseResumeInput
): Promise<ParseResumeOutput> {
  return handleAction(
    parseResume,
    input,
    'Failed to parse resume. Please check the file and try again.'
  );
}

export async function validateApiKeyAction(
  aiConfig: AiConfig
): Promise<ValidateApiKeyOutput> {
  return handleAction(
    validateApiKey,
    aiConfig,
    'An unexpected error occurred during API key validation.'
  );
}

export async function generateDocxAction(htmlString: string): Promise<string> {
  try {
    const htmlToDocx = require('html-to-docx');
    // The library returns a Buffer on the server
    const fileBuffer = await htmlToDocx(htmlString, undefined, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
    });

    // Return as base64 encoded string
    return fileBuffer.toString('base64');
  } catch (error) {
    console.error('Error generating DOCX on server:', error);
    throw new Error('Failed to generate Word document.');
  }
}
