import {googleAI} from '@genkit-ai/googleai';
import type {ModelReference} from 'genkit/model';
import type {AiConfig} from '@/lib/schemas';

/**
 * @fileOverview A factory for creating Genkit model references.
 *
 * - getModel - A function that returns a configured model reference based on the provider.
 */

const DEFAULT_MODELS = {
  google: 'gemini-1.5-flash-latest',
  openai: 'gpt-4o',
  openrouter: 'openrouter/auto',
};

export function getModel(aiConfig: AiConfig): ModelReference<any> {
  const {provider, apiKey, model: modelName} = aiConfig;

  if (!apiKey) {
    throw new Error('An API key is required to use AI features.');
  }

  const model = modelName || DEFAULT_MODELS[provider];

  switch (provider) {
    case 'google':
      return googleAI({apiKey}).model(model);
    case 'openai':
      throw new Error(
        'OpenAI integration is temporarily unavailable due to a package issue. Please select another provider.'
      );
    case 'openrouter':
      throw new Error(
        'OpenRouter integration is temporarily unavailable due to a package issue. Please select another provider.'
      );
    default:
      // This is a type-safe way to handle all cases.
      const exhaustiveCheck: never = provider;
      throw new Error(`Unsupported provider: ${exhaustiveCheck}`);
  }
}
