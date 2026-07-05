import { useEffect, useState } from 'react';
import type { Movie } from './types';
import { getTrending, HAS_API, searchMovies } from './api/tmdb';
import { useDebounce } from './hooks/useDebounce';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';

export default function App() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const trimmed = debouncedQuery.trim();
    const request = trimmed ? searchMovies(trimmed) : getTrending();

    request
      .then((results) => active && setMovies(results))
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const heading = debouncedQuery.trim() ? `Results for “${debouncedQuery.trim()}”` : 'Trending this week';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            🎬 CineFinder
          </h1>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!HAS_API && (
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
            Demo mode — showing sample movies. Add a TMDB API key (<code>VITE_TMDB_KEY</code>) for live data and posters.
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-slate-300">{heading}</h2>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : error ? (
          <p className="text-rose-400">Something went wrong: {error}</p>
        ) : movies.length === 0 ? (
          <p className="text-slate-400">No movies found.</p>
        ) : (
          <MovieGrid movies={movies} onSelect={setSelected} />
        )}
      </main>

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
