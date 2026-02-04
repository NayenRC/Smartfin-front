import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Login from '../../src/pages/Login';
import * as authService from '../../src/services/authService';

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    login: vi.fn(),
    getProfile: vi.fn(() => Promise.reject(new Error('No token'))),
}));

// Mock de react-hot-toast (o los utils que lo usan)
vi.mock('../../src/utils/toast', () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders login form correctly', () => {
        renderWithProviders(<Login />);
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    });

    it('allows user to type email and password', () => {
        renderWithProviders(<Login />);

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('shows registration link', () => {
        renderWithProviders(<Login />);
        expect(screen.getByText(/regístrate aquí/i)).toBeInTheDocument();
    });

    it('submits form when clicking login button', async () => {
        renderWithProviders(<Login />);

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /ingresar/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // El botón debería cambiar a "Iniciando sesión..."
        await waitFor(() => {
            expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
        });
    });

    it('shows forgot password link', () => {
        renderWithProviders(<Login />);
        expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument();
    });

    it('has correct input types', () => {
        renderWithProviders(<Login />);
        
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        expect(emailInput).toHaveAttribute('type', 'email');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});