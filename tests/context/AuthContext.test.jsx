import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

// Mock de API
vi.mock('../../src/services/api', () => ({
    default: {
        post: vi.fn(),
    }
}));

const TestComponent = () => {
    const { user, login, logout, getToken, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="user">{user ? user.nombre : 'no-user'}</div>
            <div data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</div>
            <button onClick={() => login('test@test.com', 'pass')}>Login</button>
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
        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('recovers user from localStorage on init', async () => {
        localStorage.setItem('token', 'token123');
        localStorage.setItem('user', JSON.stringify({ nombre: 'Persisted' }));

        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });

        expect(screen.getByTestId('user')).toHaveTextContent('Persisted');
    });

    it('handles invalid JSON in localStorage gracefully', async () => {
        localStorage.setItem('token', 'token123');
        localStorage.setItem('user', 'invalid-json');

        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('handles logout correctly', async () => {
        localStorage.setItem('token', 'token123');
        localStorage.setItem('user', JSON.stringify({ nombre: 'Test' }));

        await act(async () => {
            render(<AuthProvider><TestComponent /></AuthProvider>);
        });

        const logoutBtn = screen.getByText('Logout');
        fireEvent.click(logoutBtn);

        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('throws error if useAuth is used outside provider', () => {
        // Suppress console error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Use a separate component that calls useAuth without a provider
        const ImproperlyUsedComponent = () => {
            useAuth();
            return null;
        };

        expect(() => render(<ImproperlyUsedComponent />)).toThrow('useAuth debe usarse dentro de AuthProvider');
        consoleSpy.mockRestore();
    });
});
