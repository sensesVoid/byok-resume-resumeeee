
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
import htmlToDocx = require('html-to-docx');


export async function calculateAtsScoreAction(
  input: CalculateAtsScoreInput
): Promise<CalculateAtsScoreOutput> {
  try {
    return await calculateAtsScore(input);
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    throw new Error((error as Error).message || 'Failed to calculate ATS score. Please try again.');
  }
}

export async function generateCoverLetterAction(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  try {
    return await generateCoverLetter(input);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error((error as Error).message || 'Failed to generate cover letter. Please try again.');
  }
}

export async function improveContentAction(
  input: ImproveResumeContentInput
): Promise<ImproveResumeContentOutput> {
  try {
    return await improveResumeContent(input);
  } catch (error) {
    console.error('Error improving content:', error);
    throw new Error((error as Error).message || 'Failed to get suggestions. Please try again.');
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
      (error as Error).message || 'Failed to parse resume. Please check the file and try again.'
    );
  }
}

export async function validateApiKeyAction(
  aiConfig: AiConfig
): Promise<ValidateApiKeyOutput> {
  try {
    return await validateApiKey(aiConfig);
  } catch (error) {
    console.error('Error validating API key:', error);
    throw new Error((error as Error).message || 'An unexpected error occurred during API key validation.');
  }
}

export async function generateDocxAction(htmlString: string): Promise<string> {
  try {
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
