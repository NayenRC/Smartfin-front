import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Chat from '../../src/pages/Chat';
import { sendMessageToBot } from '../../src/services/chatService';

// Mock de authService
vi.mock('../../src/services/authService', () => ({
    getProfile: vi.fn(() => Promise.reject(new Error('No token'))),
}));

// Mock de chatService
vi.mock('../../src/services/chatService', () => ({
    sendMessageToBot: vi.fn(() => Promise.resolve({ response: 'Respuesta del bot' })),
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

    it('renders chat window component', async () => {
        renderWithProviders(<Chat />);
        await waitFor(() => {
            expect(screen.getByText(/asistente financiero/i)).toBeInTheDocument();
        });
    });

    it('has send button', async () => {
        renderWithProviders(<Chat />);
        await waitFor(() => {
            const sendButton = screen.getByRole('button');
            expect(sendButton).toBeInTheDocument();
        });
    });

    it('allows typing in input', async () => {
        renderWithProviders(<Chat />);
        
        await waitFor(() => {
            const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
            expect(input).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        fireEvent.change(input, { target: { value: 'Hola bot' } });
        expect(input.value).toBe('Hola bot');
    });

    it('sends message when clicking send button', async () => {
        renderWithProviders(<Chat />);
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/escribe tu mensaje/i)).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        fireEvent.change(input, { target: { value: 'Hola' } });
        
        const sendButton = screen.getByRole('button');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(sendMessageToBot).toHaveBeenCalledWith('Hola');
        });
    });

    it('displays bot response after sending message', async () => {
        renderWithProviders(<Chat />);
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/escribe tu mensaje/i)).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        fireEvent.change(input, { target: { value: 'Test' } });
        
        const sendButton = screen.getByRole('button');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Respuesta del bot')).toBeInTheDocument();
        });
    });

    it('handles API error gracefully', async () => {
        sendMessageToBot.mockRejectedValueOnce(new Error('Network error'));
        
        renderWithProviders(<Chat />);
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/escribe tu mensaje/i)).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        fireEvent.change(input, { target: { value: 'Test error' } });
        
        const sendButton = screen.getByRole('button');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });
});