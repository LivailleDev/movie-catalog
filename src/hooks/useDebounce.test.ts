import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 400));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(result.current).toBe('a'); // still the old value
  });

  it('updates to the latest value once the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('ab');
  });

  it('resets the timer on rapid changes and only emits the final value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    });

    // Type three characters quickly, each within the debounce window.
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abcd' });

    // Not enough idle time has passed yet — still the original value.
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe('abcd'); // only the final value lands
  });

  it('respects a custom delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 1000), {
      initialProps: { value: 'x' },
    });

    rerender({ value: 'y' });
    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe('x'); // 400ms is not enough for a 1000ms delay

    act(() => vi.advanceTimersByTime(600));
    expect(result.current).toBe('y');
  });
});
