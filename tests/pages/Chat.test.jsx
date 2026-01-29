import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Chat from '../../src/pages/Chat';
import api from '../../src/services/api';

// Mock de API
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
        localStorage.setItem('auth_token', 'fake-token');
        localStorage.setItem('auth_user', JSON.stringify({ id: '1', email: 'test@example.com' }));
    });

    it('renders initial assistant message', () => {
        renderWithProviders(<Chat />);
        expect(screen.getByText(/soy tu asistente financiero/i)).toBeInTheDocument();
    });

    it('handles sending a message and displaying robot response', async () => {
        const mockResponse = {
            data: {
                response: 'Gasto registrado correctamente 👍'
            }
        };

        api.post.mockResolvedValueOnce(mockResponse);

        renderWithProviders(<Chat />);

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        const sendButton = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Gasté 5000 en pizza' } });
        fireEvent.click(sendButton);

        // Verificamos que el mensaje del usuario aparece
        expect(screen.getByText('Gasté 5000 en pizza')).toBeInTheDocument();

        // Verificamos que se llamó a la API correctamente
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/chat', { mensaje: 'Gasté 5000 en pizza' });
        });

        // Verificamos que la respuesta del bot aparece
        await waitFor(() => {
            expect(screen.getByText('Gasto registrado correctamente 👍')).toBeInTheDocument();
        });
    });

    it('handles message sending error', async () => {
        api.post.mockRejectedValueOnce(new Error('Network error'));

        renderWithProviders(<Chat />);

        const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
        const sendButton = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Hola' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/error al procesar el mensaje/i)).toBeInTheDocument();
        });
    });
});
