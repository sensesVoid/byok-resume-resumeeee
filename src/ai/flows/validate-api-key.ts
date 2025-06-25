
'use server';

import { type AiConfig } from '@/lib/schemas';
import { z } from 'zod';

const ValidateApiKeyOutputSchema = z.object({
  isValid: z.boolean(),
  error: z.string().optional(),
});
export type ValidateApiKeyOutput = z.infer<typeof ValidateApiKeyOutputSchema>;

// This function checks if an API key is valid by making a simple, low-cost request.
export async function validateApiKey(
  aiConfig: AiConfig
): Promise<ValidateApiKeyOutput> {
  const { provider, apiKey, ollamaHost } = aiConfig;

  if (provider !== 'ollama' && !apiKey) {
    return { isValid: false, error: 'API Key is missing.' };
  }

  let url = '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    switch (provider) {
      case 'google':
        // Listing models is a good way to check for a valid key without cost.
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        break;
      
      case 'openai':
        url = 'https://api.openai.com/v1/models';
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      
      case 'openrouter':
        url = 'https://openrouter.ai/api/v1/models';
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      
      case 'ollama':
        const host = ollamaHost || 'http://localhost:11434';
        url = `${host}/api/tags`; // Simple endpoint to list local models
        break;

      default:
        const exhaustiveCheck: never = provider;
        return { isValid: false, error: `Unsupported provider: ${exhaustiveCheck}` };
    }
    
    const response = await fetch(url, { method: 'GET', headers });

    if (response.ok) {
      // The key is likely valid if we get a successful response.
      return { isValid: true };
    } else {
      // The API returned an error (e.g., 401 Unauthorized).
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `Invalid API key or network issue (Status: ${response.status}).`;
      return { isValid: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error(`API validation failed for ${provider}:`, error);
    if (provider === 'ollama') {
      return { isValid: false, error: 'Failed to connect to Ollama host. Is Ollama running and the host URL correct?' };
    }
    return { isValid: false, error: 'Failed to connect to the API provider. Check your network connection.' };
  }
}
