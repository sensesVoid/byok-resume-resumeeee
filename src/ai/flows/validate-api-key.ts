
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
  const { provider, apiKey } = aiConfig;

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
      
      case 'ollama': {
        // For Ollama, we check the proxy, which in turn checks the Ollama server.
        // Hitting the /api/tags endpoint is a reliable way to check if both are running.
        const host = 'http://localhost:3000';
        url = `${host}/api/tags`;
        break;
      }

      default:
        const exhaustiveCheck: never = provider;
        return { isValid: false, error: `Unsupported provider: ${exhaustiveCheck}` };
    }
    
    const response = await fetch(url, { method: 'GET', headers });

    if (response.ok) {
       // A 200 OK from any of these endpoints means the connection is valid.
      return { isValid: true };
    } else {
      let errorMessage = `Validation failed (${response.status} ${response.statusText}).`;
      try {
          const errorData = await response.json();
          // Try to extract a more specific message from the API's error response
          errorMessage = `Validation failed (${response.status}): ${errorData.error?.message || errorData.detail || errorData.error || JSON.stringify(errorData)}`;
      } catch (e) {
          // Error response was not JSON. The default message is sufficient.
      }
      if (response.status === 401) {
        errorMessage = 'Authentication failed. The provided API key is invalid or has expired. Please check your key.';
      }
      return { isValid: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error(`API validation failed for ${provider}:`, error);
    let friendlyError = 'Failed to connect to the API provider. Please check your network connection.';
    if (provider === 'ollama') {
      friendlyError = `Failed to connect to the Ollama proxy at http://localhost:3000. Please ensure the proxy script is running and that your Ollama server is also running.`;
    }
    return { isValid: false, error: friendlyError };
  }
}
