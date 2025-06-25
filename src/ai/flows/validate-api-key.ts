
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
  let method: 'GET' | 'POST' = 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let body: string | undefined = undefined;


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
      
      case 'ollama': {
        const host = (ollamaHost || 'http://localhost:11434').replace(/\/$/, '');
        // For Ollama, a simple GET request to the root is the most reliable way 
        // to check if the server is running, avoiding method-related errors.
        url = host;
        method = 'GET';
        body = undefined;
        break;
      }

      default:
        const exhaustiveCheck: never = provider;
        return { isValid: false, error: `Unsupported provider: ${exhaustiveCheck}` };
    }
    
    const response = await fetch(url, { method, headers, body });

    if (response.ok) {
       // For Ollama, we also check if the response body confirms it's Ollama
       if (provider === 'ollama') {
        const text = await response.text();
        if (text.includes("Ollama is running")) {
            return { isValid: true };
        }
        return { isValid: false, error: 'Connected to host, but it does not appear to be an Ollama server.' };
      }
      // The key is likely valid if we get a successful response for other providers.
      return { isValid: true };
    } else {
      if (response.status === 401) {
        return { isValid: false, error: 'Authentication failed. The provided API key is invalid or has expired. Please check your key.' };
      }
      // The API returned an error (e.g., 401 Unauthorized, 403 Forbidden).
      let errorMessage = `Invalid API key or network issue (${response.status} ${response.statusText}).`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
      } catch (e) {
        // Error response was not JSON. The default message is sufficient.
      }
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
