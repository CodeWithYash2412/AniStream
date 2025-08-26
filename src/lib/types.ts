export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    }
  }
  synopsis: string;
  score: number;
  genres: { mal_id: number; name: string }[];
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Music';
  episodes: number | null;
  status: 'Airing' | 'Complete' | 'Upcoming';
  year: number;
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  }
}

export interface Episode {
  mal_id: number;
  title: string;
  images?: {
    jpg: {
      image_url: string;
    }
  }
}
