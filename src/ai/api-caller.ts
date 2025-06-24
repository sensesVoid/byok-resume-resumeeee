'use server';

import type { AiConfig } from '@/lib/schemas';

// Helper to extract text from a provider's response
function extractTextFromResponse(
  responseData: any,
  provider: AiConfig['provider']
): string | null {
  if (provider === 'google') {
    return responseData.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  }
  if (provider === 'openai' || provider === 'openrouter') {
    return responseData.choices?.[0]?.message?.content ?? null;
  }
  return null;
}

// Universal API caller function that makes direct fetch requests
export async function callApi({
  prompt,
  aiConfig,
}: {
  prompt: string;
  aiConfig: AiConfig;
}): Promise<string> {
  const { provider, apiKey, model } = aiConfig;

  if (!apiKey) {
    throw new Error('API Key is missing. Please provide it in the form.');
  }

  let url = '';
  let payload: any;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Configure request based on the selected provider
  switch (provider) {
    case 'google':
      url = `https://generativelanguage.googleapis.com/v1beta/models/${
        model || 'gemini-1.5-flash-latest'
      }:generateContent?key=${apiKey}`;
      payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      };
      break;

    case 'openai':
      url = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      payload = {
        model: model || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      };
      break;

    case 'openrouter':
      url = 'https://openrouter.ai/api/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = 'https://resumeeee.app';
      headers['X-Title'] = 'Resumeeee';
      payload = {
        model: model || 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      };
      break;

    default:
      const exhaustiveCheck: never = provider;
      throw new Error(`Unsupported provider: ${exhaustiveCheck}`);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        responseData.error?.message || 'An unknown API error occurred.';
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    const text = extractTextFromResponse(responseData, provider);

    if (text === null) {
      throw new Error('No content received from the AI model.');
    }

    // Models sometimes wrap JSON in markdown. This extracts the JSON.
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
      return match[1]; // Return only the content of the markdown block
    }
    
    // If no markdown block is found, assume the model might have returned raw JSON
    // potentially with some leading/trailing text. We find the main JSON object.
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex > -1 && endIndex > startIndex) {
        return text.substring(startIndex, endIndex + 1);
    }
    
    // If no JSON object is found, return the raw text for the caller to handle.
    return text;
  } catch (error: any) {
    console.error(`API call failed for ${provider}:`, error);
    if (error.message.includes('API key')) {
        throw new Error('Invalid or expired API key. Please check your API key and try again.');
    }
    throw new Error(error.message || 'An unexpected error occurred during the API call.');
  }
}
