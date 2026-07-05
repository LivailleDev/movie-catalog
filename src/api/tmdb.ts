import type { Movie, MovieDetails, TMDBListResponse } from '../types';
import { SAMPLE_MOVIES } from '../data/sampleMovies';

const KEY = import.meta.env.VITE_TMDB_KEY;

/** True when a real TMDB API key is configured; otherwise the app runs on sample data. */
export const HAS_API = Boolean(KEY);

const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export function posterUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' = 'w500'
): string | null {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', KEY as string);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function getTrending(): Promise<Movie[]> {
  if (!HAS_API) return SAMPLE_MOVIES;
  const data = await tmdb<TMDBListResponse>('/trending/movie/week');
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!HAS_API) {
    const q = query.toLowerCase();
    return SAMPLE_MOVIES.filter((movie) => movie.title.toLowerCase().includes(q));
  }
  const data = await tmdb<TMDBListResponse>('/search/movie', { query });
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  if (!HAS_API) {
    const found = SAMPLE_MOVIES.find((movie) => movie.id === id);
    if (!found) throw new Error('Movie not found');
    return found;
  }
  return tmdb<MovieDetails>(`/movie/${id}`);
}
