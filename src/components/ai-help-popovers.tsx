
'use client';

import { Button } from "./ui/button";

type Provider = 'google' | 'openai' | 'openrouter' | 'anthropic';

interface HelpContentProps {
    provider: Provider;
}

export function ApiKeyHelpContent({ provider }: HelpContentProps) {
  switch (provider) {
    case 'google':
      return (
        <div>
          <p>Get your Google AI API key from Google AI Studio.</p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Go to Google AI Studio
          </a>
        </div>
      );
    case 'openai':
      return (
        <div>
          <p>Get your OpenAI API key from your OpenAI dashboard.</p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Go to OpenAI Dashboard
          </a>
        </div>
      );
    case 'openrouter':
      return (
        <div>
          <p>Get your OpenRouter API key from your account settings.</p>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Go to OpenRouter Keys
          </a>
        </div>
      );
    case 'anthropic':
        return (
          <div>
            <p>Get your Anthropic API key from your account settings.</p>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Go to Anthropic Keys
            </a>
          </div>
        );
    default:
      return <p>Select a provider to see help.</p>;
  }
}

export function ModelHelpContent({ provider }: HelpContentProps) {
    switch (provider) {
      case 'google':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">Google Model Recommendations</h4>
                <p className="text-xs">
                    For a great balance of speed, cost, and intelligence, we recommend using:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gemini-1.5-flash-latest</code>
                </p>
                <p className="text-xs">
                    For maximum power and reasoning, you can use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gemini-1.5-pro-latest</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">gemini-1.5-pro-latest</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'openai':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">OpenAI Model Recommendations</h4>
                <p className="text-xs">
                    The latest and most capable model is:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-4o</code>
                </p>
                <p className="text-xs">
                    A faster and more affordable, yet still powerful option is:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-4-turbo</code>
                </p>
                 <p className="text-xs">
                    For maximum speed on simple tasks, you can use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">gpt-3.5-turbo</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">gpt-4o</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'openrouter':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">OpenRouter Model Usage</h4>
                 <p className="text-xs">
                    To let OpenRouter automatically select the best model for the job, leave this field blank or enter:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">openrouter/auto</code>
                </p>
                <p className="text-xs">
                    To use a specific model, you must provide its full identifier. You can find a list on the OpenRouter website. Popular choices include:
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">anthropic/claude-3-haiku</code>
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">google/gemini-flash-1.5</code>
                     <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">mistralai/mistral-large</code>
                </p>
                <p className="text-xs pt-3 border-t mt-3 border-border/50 text-muted-foreground">
                    <strong>Pro Tip:</strong> For best results with resume parsing, models with a larger "context window" (like <code className="text-xs">anthropic/claude-3.5-sonnet</code> or <code className="text-xs">google/gemini-1.5-pro</code>) are recommended as they can process more of your document at once.
                </p>
            </div>
        );
      case 'anthropic':
        return (
            <div className="p-2 text-left space-y-3">
                <h4 className="font-bold">Anthropic Model Recommendations</h4>
                <p className="text-xs">
                    For the best balance of speed and intelligence, we recommend:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">claude-3-5-sonnet-20240620</code>
                </p>
                <p className="text-xs">
                    For maximum speed and affordability on simpler tasks, use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">claude-3-haiku-20240307</code>
                </p>
                 <p className="text-xs">
                    For the most powerful (and most expensive) model, use:
                    <br />
                    <code className="my-1 block bg-muted p-1.5 rounded-md text-foreground">claude-3-opus-20240229</code>
                </p>
            </div>
        );
      default:
        return <p>Select a provider to see model recommendations.</p>;
    }
}
