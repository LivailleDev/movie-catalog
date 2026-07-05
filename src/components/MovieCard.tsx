import type { Movie } from '../types';
import { posterUrl } from '../api/tmdb';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

// Deterministic gradient for the placeholder poster (used when no image is available).
const GRADIENTS = [
  'from-rose-500/30 to-indigo-500/30',
  'from-amber-500/30 to-red-500/30',
  'from-emerald-500/30 to-cyan-500/30',
  'from-violet-500/30 to-fuchsia-500/30',
  'from-sky-500/30 to-blue-600/30',
];

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const poster = posterUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const gradient = GRADIENTS[movie.id % GRADIENTS.length];

  return (
    <button
      type="button"
      onClick={() => onSelect(movie)}
      className="group text-left focus:outline-none"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-800 shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-amber-400/70">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} p-3`}>
            <span className="text-center text-sm font-semibold leading-tight text-slate-100">
              {movie.title}
            </span>
          </div>
        )}
        <span className="absolute right-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-bold text-amber-400">
          ★ {movie.vote_average.toFixed(1)}
        </span>
      </div>
      <h3 className="mt-2 line-clamp-1 text-sm font-medium text-slate-200">{movie.title}</h3>
      <p className="text-xs text-slate-500">{year}</p>
    </button>
  );
}
