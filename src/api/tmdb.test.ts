import { describe, it, expect } from 'vitest';
import { posterUrl, getTrending, searchMovies, getMovieDetails, HAS_API } from './tmdb';
import { SAMPLE_MOVIES } from '../data/sampleMovies';

// With no VITE_TMDB_KEY set in the test environment, the API layer runs in
// demo mode against SAMPLE_MOVIES. These tests pin that offline behaviour.
describe('tmdb api (demo mode)', () => {
  it('runs in demo mode when no API key is configured', () => {
    expect(HAS_API).toBe(false);
  });

  describe('posterUrl', () => {
    it('returns null when there is no poster path', () => {
      expect(posterUrl(null)).toBeNull();
    });

    it('builds a full image URL with the default size', () => {
      expect(posterUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w500/abc.jpg');
    });

    it('honours a requested size', () => {
      expect(posterUrl('/abc.jpg', 'w342')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg');
    });
  });

  describe('getTrending', () => {
    it('returns the sample catalog', async () => {
      const movies = await getTrending();
      expect(movies).toEqual(SAMPLE_MOVIES);
      expect(movies.length).toBeGreaterThan(0);
    });
  });

  describe('searchMovies', () => {
    it('filters by title, case-insensitively', async () => {
      const results = await searchMovies('inception');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Inception');
    });

    it('matches partial titles', async () => {
      const results = await searchMovies('dark');
      expect(results.some((m) => m.title === 'The Dark Knight')).toBe(true);
    });

    it('returns an empty array when nothing matches', async () => {
      const results = await searchMovies('zzz-no-such-movie');
      expect(results).toEqual([]);
    });
  });

  describe('getMovieDetails', () => {
    it('returns the matching movie by id', async () => {
      const details = await getMovieDetails(1);
      expect(details.id).toBe(1);
      expect(details.title).toBe('Interstellar');
      expect(details.genres.length).toBeGreaterThan(0);
    });

    it('throws when the id is not found', async () => {
      await expect(getMovieDetails(999999)).rejects.toThrow('Movie not found');
    });
  });
});
