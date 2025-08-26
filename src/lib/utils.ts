import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchZoro(endpoint: string, params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams(params);
    let url = `https://animeapi-six.vercel.app/anime/zoro/${endpoint}`;
    if (Object.keys(params).length > 0) {
      url += `?${searchParams.toString()}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Zoro API request failed for ${url} with status ${response.status}`);
            return { results: [], animes: [] }; // Return empty on failure
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from Zoro API: ${error}`);
        return { results: [], animes: [] }; // Return empty on error
    }
}
