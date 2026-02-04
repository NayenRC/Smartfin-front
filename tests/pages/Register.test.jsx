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
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });

    it('allows user to fill the form', () => {
        renderWithProviders(<Register />);

        const nameInput = screen.getByLabelText(/nombre/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        fireEvent.change(nameInput, { target: { value: 'New User' } });
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(nameInput).toHaveValue('New User');
        expect(emailInput).toHaveValue('new@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('shows login link', () => {
        renderWithProviders(<Register />);
        expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument();
    });
});
