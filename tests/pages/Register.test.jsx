import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Register from '../../src/pages/Register';
import api from '../../src/services/api';

// Mock del servicio API
vi.mock('../../src/services/api', () => ({
    default: {
        post: vi.fn(),
        defaults: {
            headers: {
                common: {}
            }
        }
    }
}));

// Mock de utils de toast
vi.mock('../../src/utils/toast', () => ({
    showError: vi.fn(),
}));

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe('Register Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders registration form', () => {
        renderWithProviders(<Register />);
        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });

    it('handles successful registration', async () => {
        const mockResponse = {
            data: {
                message: 'Usuario registrado exitosamente'
            }
        };

        api.post.mockResolvedValueOnce(mockResponse);

        renderWithProviders(<Register />);

        fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'New User' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
                email: 'new@example.com',
                password: 'password123',
                name: 'New User'
            }));
        });
    });

    it('displays error if email already exists', async () => {
        const errorResponse = {
            response: {
                data: { message: 'El email ya está registrado' }
            }
        };

        api.post.mockRejectedValueOnce(errorResponse);

        renderWithProviders(<Register />);

        fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Duplicate User' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText(/el email ya está registrado/i)).toBeInTheDocument();
        });
    });
});
