import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch element', () => {
    render(<Switch checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Switch checked={false} onChange={() => {}} label="Enable feature" />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    const { rerender } = render(<Switch checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(<Switch checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('applies checked styling', () => {
    const { rerender } = render(<Switch checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveClass('bg-gray-200');

    rerender(<Switch checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveClass('bg-blue-500');
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with opposite value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={true} onChange={handleChange} />);

    await user.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('can be disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toBeDisabled();

    await user.click(switchEl);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies disabled styling', () => {
    render(<Switch checked={false} onChange={() => {}} disabled />);
    expect(screen.getByRole('switch').closest('label')).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Switch checked={false} onChange={() => {}} size="sm" />);
    expect(screen.getByRole('switch')).toHaveClass('h-5', 'w-9');

    rerender(<Switch checked={false} onChange={() => {}} size="md" />);
    expect(screen.getByRole('switch')).toHaveClass('h-6', 'w-11');
  });

  it('can be toggled via label click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} label="Toggle me" />);

    await user.click(screen.getByText('Toggle me'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
