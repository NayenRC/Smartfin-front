import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import * as authService from '../../src/services/authService';

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    getProfile: vi.fn(),
}));

const TestComponent = () => {
    const { user, logout } = useAuth();
    return (
        <div>
            <div data-testid="user">{user ? user.nombre : 'no-user'}</div>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('initializes with null user if no storage', async () => {
        authService.getProfile.mockRejectedValue(new Error('No token'));
        
        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('recovers user from localStorage on init', async () => {
        // Mock getProfile para que retorne exitosamente el usuario
        authService.getProfile.mockResolvedValue({ user: { nombre: 'Persisted' } });
        
        localStorage.setItem('token', 'token123');
        localStorage.setItem('user', JSON.stringify({ nombre: 'Persisted' }));

        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });

        // Esperar a que se termine el loading y getProfile actualice el usuario
        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('Persisted');
        });
    });

    it('handles logout correctly', async () => {
        authService.getProfile.mockResolvedValue({ user: { nombre: 'Test' } });
        
        localStorage.setItem('token', 'token123');
        localStorage.setItem('user', JSON.stringify({ nombre: 'Test' }));

        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });

        const logoutBtn = screen.getByText('Logout');
        fireEvent.click(logoutBtn);

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
});
