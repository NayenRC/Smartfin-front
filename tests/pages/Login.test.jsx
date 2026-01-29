import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Login from '../../src/pages/Login';
import api from '../../src/services/api';

// Mock del servicio API
vi.mock('../../src/services/api', () => ({
    default: {
        post: vi.fn(),
    }
}));

// Mock de react-hot-toast (o los utils que lo usan)
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

    it('handles successful login', async () => {
        const mockUser = { id: '123', nombre: 'Test User', email: 'test@example.com' };
        const mockResponse = {
            data: {
                token: 'fake-token',
                user: mockUser
            }
        };

        api.post.mockResolvedValueOnce(mockResponse);

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
        });

        // Debería guardar en localStorage (AuthContext lo hace)
        expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('displays error message on failed login', async () => {
        const errorResponse = {
            response: {
                data: { message: 'Credenciales inválidas' }
            }
        };

        api.post.mockRejectedValueOnce(errorResponse);

        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

        await waitFor(() => {
            expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
        });
    });
});
