import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Categories from '../../src/pages/Categories';
import api from '../../src/services/api';

// Mock de API
vi.mock('../../src/services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        defaults: {
            headers: {
                common: {}
            }
        }
    }
}));

// Mock de utils de toast
vi.mock('../../src/utils/toast', () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
}));

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe('Categories Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('auth_token', 'fake-token');
        localStorage.setItem('auth_user', JSON.stringify({ id: '1', email: 'test@example.com' }));

        // Mock de window.confirm
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    it('renders categories list', async () => {
        const mockCategories = [
            { id_categoria: 1, nombre: 'Comida', tipo: 'GASTO', icon: '🍔' },
            { id_categoria: 2, nombre: 'Sueldo', tipo: 'INGRESO', icon: '💰' }
        ];

        api.get.mockResolvedValueOnce({ data: mockCategories });

        renderWithProviders(<Categories />);

        expect(screen.getByText(/cargando categorías/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Comida')).toBeInTheDocument();
            expect(screen.getByText('Sueldo')).toBeInTheDocument();
        });
    });

    it('handles category deletion', async () => {
        const mockCategories = [
            { id_categoria: 1, nombre: 'Comida', tipo: 'GASTO', icon: '🍔' }
        ];

        api.get.mockResolvedValueOnce({ data: mockCategories });
        api.delete.mockResolvedValueOnce({ data: { success: true } });

        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(screen.getByText('Comida')).toBeInTheDocument();
        });

        // Encontrar botón de eliminar por su título
        const deleteButton = screen.getByTitle(/eliminar/i);

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalled();
            expect(api.delete).toHaveBeenCalledWith('/categorias/1');
        });
    });

    it('handles category creation', async () => {
        api.get.mockResolvedValueOnce({ data: [] });
        api.post.mockResolvedValueOnce({ data: { id_categoria: 3, nombre: 'Ocio', tipo: 'GASTO' } });

        renderWithProviders(<Categories />);

        const createBtn = screen.getByRole('button', { name: /nueva categoría/i });
        fireEvent.click(createBtn);

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ocio' } });
        fireEvent.click(screen.getByRole('button', { name: /crear/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
            expect(screen.getByText('Ocio')).toBeInTheDocument();
        });
    });

    it('handles category update', async () => {
        const mockCategories = [{ id_categoria: 1, nombre: 'Comida', tipo: 'GASTO' }];
        api.get.mockResolvedValueOnce({ data: mockCategories });
        api.put.mockResolvedValueOnce({ data: { id_categoria: 1, nombre: 'Restaurantes', tipo: 'GASTO' } });

        renderWithProviders(<Categories />);

        await waitFor(() => screen.getByText('Comida'));

        const editBtn = screen.getByTitle(/editar/i);
        fireEvent.click(editBtn);

        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Restaurantes' } });
        fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalled();
            expect(screen.getByText('Restaurantes')).toBeInTheDocument();
        });
    });

    it('renders error state on fetch failure', async () => {
        api.get.mockRejectedValueOnce(new Error('Fetch failed'));

        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(screen.getByText(/no se pudieron cargar las categorías/i)).toBeInTheDocument();
        });
    });
});
