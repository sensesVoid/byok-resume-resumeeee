import {googleAI} from '@genkit-ai/googleai';
import type {ModelReference} from 'genkit/model';
import type {AiConfig} from '@/lib/schemas';

/**
 * @fileOverview A factory for creating Genkit model references.
 *
 * - getModel - A function that returns a configured model reference for Google AI.
 */

const DEFAULT_MODEL = 'gemini-1.5-flash-latest';

export function getModel(aiConfig: AiConfig): ModelReference<any> {
  const {apiKey, model: modelName} = aiConfig;

  if (!apiKey) {
    throw new Error('A Google AI API key is required.');
  }

  const model = modelName || DEFAULT_MODEL;

  return googleAI({apiKey}).model(model);
}
