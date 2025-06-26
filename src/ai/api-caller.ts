
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
  // OpenAI and OpenRouter use the same format
  if (provider === 'openai' || provider === 'openrouter') {
    return responseData.choices?.[0]?.message?.content ?? null;
  }
  if (provider === 'anthropic') {
    return responseData.content?.[0]?.text ?? null;
  }
  return null;
}

/**
 * Extracts a JSON object from a string. It can handle JSON wrapped in markdown code blocks
 * or the first valid JSON object embedded within other text.
 * @param text The string to extract JSON from.
 * @returns A string containing the JSON object, or null if no valid JSON is found.
 */
function extractJson(text: string): string | null {
    // 1. Try to find JSON within markdown code blocks first.
    const markdownRegex = /```json\s*([\s\S]*?)\s*```/;
    const markdownMatch = text.match(markdownRegex);
    if (markdownMatch && markdownMatch[1]) {
        try {
            JSON.parse(markdownMatch[1]);
            return markdownMatch[1]; // It's valid JSON.
        } catch {
            // Fall through if parsing fails, maybe the ``` was just text.
        }
    }

    // 2. If no valid markdown, find the first potential JSON object using brace counting.
    let braceCount = 0;
    let startIndex = -1;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            if (startIndex === -1) {
                startIndex = i;
            }
            braceCount++;
        } else if (text[i] === '}') {
            if (startIndex === -1) continue; // Skip closing braces before an opening one
            braceCount--;
            if (braceCount === 0) {
                const potentialJson = text.substring(startIndex, i + 1);
                try {
                    JSON.parse(potentialJson);
                    return potentialJson; // Found the first valid, complete JSON object.
                } catch (e) {
                    // This wasn't a valid JSON object. Reset and continue searching.
                    startIndex = -1;
                    braceCount = 0;
                }
            }
        }
    }

    return null; // No valid JSON object found
}


// Universal API caller function that makes direct fetch requests
export async function callApi({
  prompts,
  aiConfig,
}: {
  prompts: { system: string; user: string };
  aiConfig: AiConfig;
}): Promise<string> {
  const { provider, apiKey, model } = aiConfig;
  const { system, user } = prompts;

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
        contents: [{ parts: [{ text: `${system}\n\n${user}` }] }],
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
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ],
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
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ],
        response_format: { type: 'json_object' },
      };
      break;
    
    case 'anthropic':
      url = 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      payload = {
        model: model || 'claude-3-haiku-20240307',
        system: system,
        messages: [{ role: 'user', content: user }],
        max_tokens: 4096,
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

    if (!response.ok) {
        let errorMessage = `API Error (${response.status} ${response.statusText})`;
        try {
            const errorData = await response.json();
            // Try to extract a more specific message from the API's error response
            errorMessage = `API Error (${response.status}): ${errorData.error?.message || errorData.error?.type || errorData.detail || JSON.stringify(errorData)}`;
        } catch (e) {
            // The error response was not JSON. The status text is the best we can do.
        }
        if (response.status === 401) {
            errorMessage = 'Authentication failed. The provided API key is invalid, has expired, or does not have sufficient permissions. Please check your key and try again.';
        }
        throw new Error(errorMessage);
    }

    const responseData = await response.json();

    // Specific check for Google's safety blocks, which returns a 200 OK but no content.
    if (provider === 'google' && responseData.promptFeedback?.blockReason) {
        const reason = responseData.promptFeedback.blockReason;
        throw new Error(`Request blocked by Google for safety reasons: ${reason}. Please try modifying your content.`);
    }

    // Anthropic can sometimes return an error even with a 200 OK
    if (provider === 'anthropic' && responseData.type === 'error') {
        const reason = responseData.error?.message || 'Unknown error';
        throw new Error(`Anthropic API Error: ${reason}`);
    }

    const text = extractTextFromResponse(responseData, provider);

    if (text === null) {
      throw new Error('No content received from the AI model.');
    }
    
    const jsonString = extractJson(text);
    
    if (!jsonString) {
      console.error("AI returned non-JSON response:", text);
      throw new Error("The AI returned a response in an unexpected format. Please try again.");
    }
    
    return jsonString;

  } catch (error: any) {
    console.error(`API call failed for ${provider}:`, error);
    if (error.message.includes('Failed to fetch')) {
        throw new Error(`The AI provider could not be reached. Please check your network connection and CORS settings.`);
    }
    // Re-throw the specific error we created or a generic one
    throw new Error(error.message || 'An unexpected error occurred during the API call.');
  }
}
