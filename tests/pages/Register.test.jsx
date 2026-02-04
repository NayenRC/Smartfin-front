import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import Register from '../../src/pages/Register';
import * as authService from '../../src/services/authService';

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    register: vi.fn(),
    getProfile: vi.fn(() => Promise.reject(new Error('No token'))),
}));

// Mock de utils de toast
vi.mock('../../src/utils/toast', () => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
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

    it('has correct input types', () => {
        renderWithProviders(<Register />);
        
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        expect(emailInput).toHaveAttribute('type', 'email');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('has required fields', () => {
        renderWithProviders(<Register />);
        
        const nameInput = screen.getByLabelText(/nombre/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        expect(nameInput).toBeRequired();
        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('displays SmartFin branding', () => {
        renderWithProviders(<Register />);
        // SmartFin está dividido en dos spans: Smart y fin
        expect(screen.getByText(/smart/i)).toBeInTheDocument();
        // fin aparece múltiples veces, usamos getAllByText
        const finElements = screen.getAllByText(/fin/i);
        expect(finElements.length).toBeGreaterThan(0);
    });
});