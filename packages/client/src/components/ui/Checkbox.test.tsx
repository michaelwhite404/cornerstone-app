import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('can be checked by default', () => {
    render(<Checkbox defaultChecked aria-label="Checked" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles checked state when clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Toggle" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} aria-label="Change" />);

    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports controlled checked state', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked={false} onChange={handleChange} aria-label="Controlled" />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalled();

    // Still unchecked because controlled
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    // Parent updates the checked prop
    rerender(<Checkbox checked={true} onChange={handleChange} aria-label="Controlled" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('applies size classes', () => {
    const { rerender } = render(<Checkbox size="sm" aria-label="Small" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-3', 'w-3');

    rerender(<Checkbox size="md" aria-label="Medium" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4', 'w-4');

    rerender(<Checkbox size="lg" aria-label="Large" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5', 'w-5');
  });

  it('can be disabled', () => {
    render(<Checkbox disabled aria-label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('sets indeterminate state', () => {
    render(<Checkbox indeterminate aria-label="Indeterminate" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });
});
