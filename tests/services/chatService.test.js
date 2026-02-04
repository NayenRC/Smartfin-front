import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessageToBot } from '../../src/services/chatService';
import api from '../../src/services/api';

// Mock del módulo api
vi.mock('../../src/services/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    }
}));

describe('chatService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('sendMessageToBot', () => {
        it('sends message and returns bot response', async () => {
            const mockResponse = {
                data: {
                    response: 'Hola! Soy tu asistente financiero.',
                    timestamp: '2026-02-04T12:00:00Z'
                }
            };

            api.post.mockResolvedValueOnce(mockResponse);

            const result = await sendMessageToBot('Hola');

            expect(api.post).toHaveBeenCalledWith('/chat', { mensaje: 'Hola' });
            expect(result).toEqual(mockResponse.data);
        });

        it('sends correct payload with mensaje field', async () => {
            api.post.mockResolvedValueOnce({ data: { response: 'OK' } });

            await sendMessageToBot('¿Cuál es mi balance?');

            expect(api.post).toHaveBeenCalledWith('/chat', {
                mensaje: '¿Cuál es mi balance?'
            });
        });

        it('handles API errors', async () => {
            api.post.mockRejectedValueOnce(new Error('Network error'));

            await expect(sendMessageToBot('Test')).rejects.toThrow('Network error');
        });

        it('handles empty response', async () => {
            api.post.mockResolvedValueOnce({ data: {} });

            const result = await sendMessageToBot('Test');

            expect(result).toEqual({});
        });

        it('handles long messages', async () => {
            const longMessage = 'a'.repeat(1000);
            api.post.mockResolvedValueOnce({ data: { response: 'Received' } });

            await sendMessageToBot(longMessage);

            expect(api.post).toHaveBeenCalledWith('/chat', { mensaje: longMessage });
        });
    });
});
