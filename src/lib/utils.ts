import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitize(text: string | undefined | null): string {
    if (!text) {
        return '';
    }
    // This is a basic placeholder to prevent crashes.
    // It returns the text as-is.
    return text;
}
