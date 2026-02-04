import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Categories from '../../src/pages/Categories';

// Mock de categoryService
vi.mock('../../src/services/categoryService', () => ({
    default: {
        getCategories: vi.fn(() => Promise.resolve([
            { id_categoria: 1, nombre: 'Comida', tipo: 'GASTO', color: '#ff0000' },
            { id_categoria: 2, nombre: 'Sueldo', tipo: 'INGRESO', color: '#00ff00' }
        ])),
        createCategory: vi.fn(),
        updateCategory: vi.fn(),
        deleteCategory: vi.fn(),
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
});
