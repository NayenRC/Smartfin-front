import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Chat from '../../src/pages/Chat';

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

describe('Chat Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));
    });

    it('renders chat page with input', async () => {
        renderWithProviders(<Chat />);
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/escribe tu mensaje/i)).toBeInTheDocument();
        });
    });

    it('renders initial welcome message', async () => {
        renderWithProviders(<Chat />);
        await waitFor(() => {
            expect(screen.getByText(/hola/i)).toBeInTheDocument();
        });
    });
});
