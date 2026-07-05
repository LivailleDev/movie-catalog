import { useEffect, useState } from 'react';
import type { Movie, MovieDetails } from '../types';
import { getMovieDetails, posterUrl } from '../api/tmdb';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function runtimeLabel(minutes: number | null): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMovieDetails(movie.id)
      .then((data) => active && setDetails(data))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, [movie.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const poster = posterUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const runtime = runtimeLabel(details?.runtime ?? null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-xl text-slate-200 hover:bg-black/80"
        >
          ×
        </button>

        <div className="flex flex-col gap-5 p-5 sm:flex-row">
          <div className="mx-auto w-40 shrink-0 sm:mx-0">
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
              {poster ? (
                <img src={poster} alt={movie.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 p-3 text-center text-sm font-semibold text-slate-200">
                  {movie.title}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{movie.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="font-semibold text-amber-400">★ {movie.vote_average.toFixed(1)}</span>
              <span>{year}</span>
              {runtime && <span>{runtime}</span>}
            </div>

            {details?.tagline && (
              <p className="mt-2 text-sm italic text-slate-400">“{details.tagline}”</p>
            )}

            {details && (
              <div className="mt-3 flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {movie.overview || 'No overview available.'}
            </p>

            {error && <p className="mt-3 text-sm text-rose-400">Could not load details: {error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
