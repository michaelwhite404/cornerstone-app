import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  it('renders a select element', () => {
    render(<Select options={options} aria-label="Select option" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={options} aria-label="Select option" />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('renders children instead of options when provided', () => {
    render(
      <Select aria-label="Select option">
        <option value="a">Choice A</option>
        <option value="b">Choice B</option>
      </Select>
    );
    expect(screen.getByRole('option', { name: 'Choice A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Choice B' })).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={options} onChange={handleChange} aria-label="Select" />);

    await user.selectOptions(screen.getByRole('combobox'), '2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('reflects selected value', async () => {
    const user = userEvent.setup();
    render(<Select options={options} aria-label="Select" />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '2');
    expect(select).toHaveValue('2');
  });

  it('applies fill class for full width', () => {
    render(<Select options={options} fill aria-label="Select" />);
    expect(screen.getByRole('combobox')).toHaveClass('w-full');
  });

  it('applies large size class', () => {
    render(<Select options={options} large aria-label="Select" />);
    expect(screen.getByRole('combobox')).toHaveClass('py-2.5', 'text-base');
  });

  it('applies small size class', () => {
    render(<Select options={options} small aria-label="Select" />);
    expect(screen.getByRole('combobox')).toHaveClass('py-1', 'text-xs');
  });

  it('can be disabled', () => {
    render(<Select options={options} disabled aria-label="Select" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('supports numeric values', () => {
    const numericOptions = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];
    render(<Select options={numericOptions} aria-label="Select" />);
    expect(screen.getByRole('option', { name: 'One' })).toHaveValue('1');
  });
});
