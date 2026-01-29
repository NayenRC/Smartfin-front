import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Dashboard from '../../src/pages/Dashboard';
import api from '../../src/services/api';

// Mock de Recharts (o los componentes que lo usan)
vi.mock('../../src/components/dashboard/ExpensesChart', () => ({
    default: () => <div data-testid="expenses-chart">Expenses Chart</div>
}));
vi.mock('../../src/components/dashboard/BalanceChart', () => ({
    default: () => <div data-testid="balance-chart">Balance Chart</div>
}));

// Mock de API
vi.mock('../../src/services/api', () => ({
    default: {
        get: vi.fn(),
    }
}));

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe('Dashboard Page', () => {
    beforeEach(() => {
        localStorage.clear();
        // Simulamos un usuario logueado en localStorage
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com', nombre: 'Test' }));
    });

    it('renders dashboard with correct data from API', async () => {
        const mockSummary = {
            income: 10000,
            expenses: 4000,
            balance: 6000,
            expensesByCategory: [
                { categoria: 'Comida', total: 2000, cantidad: 5 },
                { categoria: 'Transporte', total: 2000, cantidad: 2 }
            ]
        };

        // Dashboard llama a /dashboard/summary, /dashboard/resumen y /metas
        api.get.mockImplementation((url) => {
            if (url === '/dashboard/summary') {
                return Promise.resolve({ data: mockSummary });
            }
            if (url === '/dashboard/resumen') {
                return Promise.resolve({ data: { ingresos: 10000, gastos: 4000, balance: 6000 } });
            }
            if (url === '/metas') {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error('not found'));
        });

        renderWithProviders(<Dashboard />);

        // Verificamos cargando (opcional)
        // expect(screen.getByText(/cargando/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/10[.,]000/)).toBeInTheDocument();
            expect(screen.getByText(/4[.,]000/)).toBeInTheDocument();
            expect(screen.getByText(/6[.,]000/)).toBeInTheDocument();
        });

        expect(screen.getByTestId('expenses-chart')).toBeInTheDocument();
        expect(screen.getByTestId('balance-chart')).toBeInTheDocument();
    });

    it('handles error gracefully when API fails', async () => {
        api.get.mockRejectedValue(new Error('Network error'));

        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/no se pudo obtener la información/i)).toBeInTheDocument();
        });
    });
});
