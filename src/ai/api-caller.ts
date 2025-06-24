'use server';

import type { AiConfig } from '@/lib/schemas';

interface CallApiParams {
  prompt: string;
  aiConfig: AiConfig;
}

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
}: CallApiParams): Promise<string> {
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
          // Request JSON output from Gemini
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
        // Request JSON output from OpenAI
        response_format: { type: 'json_object' },
      };
      break;

    case 'openrouter':
      url = 'https://openrouter.ai/api/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      // Recommended headers for OpenRouter
      headers['HTTP-Referer'] = 'https://resumeeee.app';
      headers['X-Title'] = 'Resumeeee';
      payload = {
        model: model || 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }],
        // Request JSON output from OpenRouter compatible models
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

    // The text can be a JSON string, but sometimes models wrap it in markdown
    // or add conversational text. This logic finds and extracts the JSON object.
    
    // First, check for a markdown code block
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    
    let jsonString = text;
    if (match && match[1]) {
      jsonString = match[1];
    } else {
      // If no markdown, find the first '{' and last '}' to extract the object
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonString = text.substring(startIndex, endIndex + 1);
      }
    }

    return jsonString;
  } catch (error: any) {
    console.error(`API call failed for ${provider}:`, error);
    // Re-throw the error with a more user-friendly message
    if (error.message.includes('API key')) {
        throw new Error('Invalid or expired API key. Please check your API key and try again.');
    }
    throw new Error(error.message || 'An unexpected error occurred during the API call.');
  }
}
