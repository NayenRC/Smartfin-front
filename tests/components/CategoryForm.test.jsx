import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryForm from '../../src/components/categories/CategoryForm';

describe('CategoryForm Component', () => {
    it('renders for creation by default', () => {
        render(<CategoryForm onSubmit={() => { }} onCancel={() => { }} />);
        expect(screen.getByText(/nueva categoría/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
        expect(screen.getByLabelText(/gasto/i)).toBeChecked();
    });

    it('renders with initial data for editing', () => {
        const initialData = { name: 'Comida', type: 'expense', color: '#ff0000' };
        render(<CategoryForm initialData={initialData} onSubmit={() => { }} onCancel={() => { }} />);
        expect(screen.getByText(/editar categoría/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toHaveValue('Comida');
    });

    it('calls onSubmit with form data', () => {
        const onSubmit = vi.fn();
        render(<CategoryForm onSubmit={onSubmit} onCancel={() => { }} />);

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Inversiones' } });
        fireEvent.click(screen.getByLabelText(/ingreso/i));
        fireEvent.click(screen.getByRole('button', { name: /crear/i }));

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Inversiones',
            type: 'income'
        }));
    });

    it('calls onCancel when clicking cancel button', () => {
        const onCancel = vi.fn();
        render(<CategoryForm onSubmit={() => { }} onCancel={onCancel} />);
        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(onCancel).toHaveBeenCalled();
    });
});
