
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
  const { provider, apiKey, model } = aiConfig;

  if (!apiKey) {
    return { isValid: false, error: 'API Key is missing.' };
  }

  let url = '';
  let options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };


  try {
    switch (provider) {
      case 'google':
        // Listing models is a good way to check for a valid key without cost.
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        break;
      
      case 'openai':
        url = 'https://api.openai.com/v1/models';
        options.headers!['Authorization'] = `Bearer ${apiKey}`;
        break;
      
      case 'openrouter':
        url = 'https://openrouter.ai/api/v1/models';
        options.headers!['Authorization'] = `Bearer ${apiKey}`;
        break;

      case 'anthropic':
        // For Anthropic, we must make a POST request, as there's no simple GET endpoint.
        // We'll send a very small, cheap request to check the key.
        url = 'https://api.anthropic.com/v1/messages';
        options.method = 'POST';
        options.headers!['x-api-key'] = apiKey;
        options.headers!['anthropic-version'] = '2023-06-01';
        options.body = JSON.stringify({
          model: model || 'claude-3-haiku-20240307',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        });
        break;
      
      default:
        const exhaustiveCheck: never = provider;
        return { isValid: false, error: `Unsupported provider: ${exhaustiveCheck}` };
    }
    
    const response = await fetch(url, options);

    if (response.ok) {
       // A 200 OK from any of these endpoints means the connection is valid.
      return { isValid: true };
    } else {
      let errorMessage = `Validation failed (${response.status} ${response.statusText}).`;
      try {
          const errorData = await response.json();
          // Try to extract a more specific message from the API's error response
          errorMessage = `Validation failed (${response.status}): ${errorData.error?.message || errorData.error?.type || errorData.detail || JSON.stringify(errorData)}`;
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
    return { isValid: false, error: 'Failed to connect to the API provider. Please check your network connection.' };
  }
}
