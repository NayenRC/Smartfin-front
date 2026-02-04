import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Categories from '../../src/pages/Categories';
import categoryService from '../../src/services/categoryService';

// Mock de categoryService
vi.mock('../../src/services/categoryService', () => ({
    default: {
        getCategories: vi.fn(() => Promise.resolve([
            { id_categoria: 1, nombre: 'Comida', name: 'Comida', tipo: 'GASTO', color: '#ff0000' },
            { id_categoria: 2, nombre: 'Sueldo', name: 'Sueldo', tipo: 'INGRESO', color: '#00ff00' }
        ])),
        createCategory: vi.fn(() => Promise.resolve({ id_categoria: 3, nombre: 'Nueva', name: 'Nueva', tipo: 'GASTO', color: '#0000ff' })),
        updateCategory: vi.fn(() => Promise.resolve({ id_categoria: 1, nombre: 'Comida Editada', name: 'Comida Editada', tipo: 'GASTO', color: '#ff0000' })),
        deleteCategory: vi.fn(() => Promise.resolve()),
    }
}));

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    getProfile: vi.fn(() => Promise.reject(new Error('No token'))),
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
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));
    });

    it('renders categories page title', async () => {
        renderWithProviders(<Categories />);
        
        await waitFor(() => {
            expect(screen.getByText(/categorías/i)).toBeInTheDocument();
        });
    });

    it('renders new category button', async () => {
        renderWithProviders(<Categories />);
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /nueva categoría/i })).toBeInTheDocument();
        });
    });

    it('shows categories after loading', async () => {
        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(screen.getByText('Comida')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Sueldo')).toBeInTheDocument();
        });
    });

    it('opens form when clicking new category button', async () => {
        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /nueva categoría/i })).toBeInTheDocument();
        });

        const button = screen.getByRole('button', { name: /nueva categoría/i });
        fireEvent.click(button);

        await waitFor(() => {
            // El formulario debería mostrarse
            expect(screen.getByText(/nombre/i)).toBeInTheDocument();
        });
    });

    it('calls getCategories on mount', async () => {
        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(categoryService.getCategories).toHaveBeenCalled();
        });
    });

    it('handles error state when fetch fails', async () => {
        categoryService.getCategories.mockRejectedValueOnce(new Error('Network error'));

        renderWithProviders(<Categories />);

        await waitFor(() => {
            expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument();
        });
    });
});