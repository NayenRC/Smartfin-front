import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavingsGoals from '../../src/components/dashboard/SavingsGoals';
import api from '../../src/services/api';

// Mock de API
vi.mock('../../src/services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        defaults: {
            headers: {
                common: {}
            }
        }
    }
}));

describe('SavingsGoals Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    it('renders empty state when no goals', async () => {
        api.get.mockResolvedValueOnce({ data: [] });
        render(<SavingsGoals />);
        await waitFor(() => {
            expect(screen.getByText(/no tienes metas activas/i)).toBeInTheDocument();
        });
    });

    it('renders goals list', async () => {
        const mockGoals = [
            { id_meta: 1, nombre: 'Viaje', monto_actual: 100, monto_objetivo: 1000 }
        ];
        api.get.mockResolvedValueOnce({ data: mockGoals });
        render(<SavingsGoals />);
        await waitFor(() => {
            expect(screen.getByText('Viaje')).toBeInTheDocument();
            expect(screen.getByText(/10% completado/i)).toBeInTheDocument();
        });
    });

    it('handles creating a new goal', async () => {
        api.get.mockResolvedValue({ data: [] }); // Primera carga y después del post
        api.post.mockResolvedValueOnce({ data: { success: true } });

        render(<SavingsGoals />);

        // Abrir formulario
        const addButton = screen.getByTitle(/nueva meta/i);
        fireEvent.click(addButton);

        // Llenar campos
        fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: 'Ahorro PC' } });
        fireEvent.change(screen.getByPlaceholderText(/monto objetivo/i), { target: { value: '500000' } });

        fireEvent.click(screen.getByRole('button', { name: /asignar meta/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/metas', expect.objectContaining({
                nombre: 'Ahorro PC',
                monto_objetivo: '500000'
            }));
        });
    });
});
