import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';
import type { Movie } from '../types';

const baseMovie: Movie = {
  id: 42,
  title: 'Blade Runner 2049',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.0,
  release_date: '2017-10-06',
  overview: 'A young blade runner discovers a long-buried secret.',
};

describe('MovieCard', () => {
  it('renders the title, release year and rating', () => {
    render(<MovieCard movie={baseMovie} onSelect={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Blade Runner 2049' })).toBeInTheDocument();
    expect(screen.getByText('2017')).toBeInTheDocument();
    expect(screen.getByText('★ 8.0')).toBeInTheDocument();
  });

  it('shows a placeholder (no <img>) when the movie has no poster', () => {
    render(<MovieCard movie={baseMovie} onSelect={() => {}} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the poster image when a poster path is present', () => {
    render(<MovieCard movie={{ ...baseMovie, poster_path: '/poster.jpg' }} onSelect={() => {}} />);
    const img = screen.getByRole('img', { name: 'Blade Runner 2049' });
    expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w342/poster.jpg');
  });

  it('falls back to an em dash when there is no release date', () => {
    render(<MovieCard movie={{ ...baseMovie, release_date: '' }} onSelect={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('calls onSelect with the movie when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MovieCard movie={baseMovie} onSelect={onSelect} />);

    await user.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(baseMovie);
  });
});
