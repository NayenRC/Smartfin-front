import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Dashboard from '../../src/pages/Dashboard';

// Mock de Recharts (o los componentes que lo usan)
vi.mock('../../src/components/dashboard/ExpensesChart', () => ({
    default: () => <div data-testid="expenses-chart">Expenses Chart</div>
}));
vi.mock('../../src/components/dashboard/BalanceChart', () => ({
    default: () => <div data-testid="balance-chart">Balance Chart</div>
}));

// Mock de dashboardService
vi.mock('../../src/services/dashboardService', () => ({
    getDashboardResumen: vi.fn(() => Promise.resolve({
        ingresos: 10000,
        gastos: 4000,
        balance: 6000,
        por_categoria: []
    }))
}));

// Mock de transactionService
vi.mock('../../src/services/transactionService', () => ({
    getRecentTransactions: vi.fn(() => Promise.resolve([]))
}));

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    getProfile: vi.fn(() => Promise.reject(new Error('No token'))),
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
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com', nombre: 'Test' }));
    });

    it('renders dashboard loading state initially', async () => {
        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/cargando/i)).toBeInTheDocument();
        });
    });

    it('renders dashboard components', async () => {
        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByTestId('expenses-chart')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
