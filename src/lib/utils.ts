import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchJikan(endpoint: string, params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams(params);
    const url = `https://api.jikan.moe/v4/${endpoint}?${searchParams.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Jikan API request failed for ${url} with status ${response.status}`);
            return { data: [] }; // Return empty data on failure
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from Jikan API: ${error}`);
        return { data: [] }; // Return empty data on error
    }
}
