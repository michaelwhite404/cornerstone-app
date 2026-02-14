import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts and displays user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('calls onChange when input changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type" />);

    await user.type(screen.getByPlaceholderText('Type'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with left icon', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(<Input leftIcon={leftIcon} placeholder="Search" />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toHaveClass('pl-10');
  });

  it('renders with right element', () => {
    const rightElement = <button data-testid="clear-btn">×</button>;
    render(<Input rightElement={rightElement} placeholder="With clear" />);
    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('With clear')).toHaveClass('pr-10');
  });

  it('applies fill class for full width', () => {
    render(<Input fill placeholder="Full width" />);
    expect(screen.getByPlaceholderText('Full width')).toHaveClass('w-full');
  });

  it('applies large size class', () => {
    render(<Input large placeholder="Large" />);
    expect(screen.getByPlaceholderText('Large')).toHaveClass('py-2.5', 'text-base');
  });

  it('applies small size class', () => {
    render(<Input small placeholder="Small" />);
    expect(screen.getByPlaceholderText('Small')).toHaveClass('py-1', 'text-xs');
  });

  it('forwards ref to input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('supports different input types', () => {
    render(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });
});
