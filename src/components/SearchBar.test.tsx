import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders a search input showing the current value', () => {
    render(<SearchBar value="matrix" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search movies…') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('matrix');
  });

  it('calls onChange with each keystroke', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('Search movies…'), 'go');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'g');
    expect(onChange).toHaveBeenNthCalledWith(2, 'o');
  });
});
