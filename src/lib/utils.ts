import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'isomorphic-dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitize(text: string | undefined | null): string {
    if (!text) {
        return '';
    }
    // Sanitize the text using isomorphic-dompurify, which is safe for both server and client rendering.
    // This prevents XSS attacks by stripping any potentially malicious HTML/JS from user inputs.
    return DOMPurify.sanitize(text);
}
