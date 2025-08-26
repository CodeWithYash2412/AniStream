export interface Anime {
  id: string;
  title: string;
  image: string;
  cover: string;
  malId: number;
  genres: string[];
  description: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Music';
  releaseDate: string; // Year
  totalEpisodes: number;
  episodes: {
    id: string;
    number: number;
    title: string;
    url: string;
    image: string;
  }[];
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  image?: string;
}

export interface SearchResult {
    id: string;
    title: string;
    image: string;
    type: string;
    releaseDate: string;
}
