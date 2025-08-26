export interface Anime {
  id: string;
  title: string;
  poster: string;
  description: string;
  rating: number;
  genres: string[];
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Completed';
  episodes: Episode[];
  status: 'Airing' | 'Completed';
  addedDate: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  thumbnail: string;
  duration: number; // in minutes
}
