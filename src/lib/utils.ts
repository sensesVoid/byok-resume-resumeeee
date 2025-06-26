import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitize(text: string | undefined | null): string {
    // Return an empty string for SSR or if text is null/undefined
    if (typeof window === 'undefined' || !text) {
        return '';
    }
    // Return the sanitized string, which will be plain text
    return DOMPurify.sanitize(text, { USE_PROFILES: { html: false } });
}
