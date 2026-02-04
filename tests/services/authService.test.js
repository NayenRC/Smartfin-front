import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, register, getProfile } from '../../src/services/authService';

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; }),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    // ==================
    // LOGIN TESTS
    // ==================
    describe('login', () => {
        it('returns error when email is empty', async () => {
            const result = await login('', 'password123');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Email y contraseña son requeridos');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('returns error when password is empty', async () => {
            const result = await login('test@test.com', '');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Email y contraseña son requeridos');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('returns success and stores token on successful login', async () => {
            const mockResponse = {
                token: 'fake-token-123',
                user: { id: 1, email: 'test@test.com', nombre: 'Test User' }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const result = await login('test@test.com', 'password123');

            expect(result.success).toBe(true);
            expect(result.token).toBe('fake-token-123');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-token-123');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
        });

        it('returns error message on failed login', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'Credenciales incorrectas' })
            });

            const result = await login('test@test.com', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Credenciales incorrectas');
        });

        it('returns default error message when no message provided', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({})
            });

            const result = await login('test@test.com', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Error al iniciar sesión');
        });
    });

    // ==================
    // REGISTER TESTS
    // ==================
    describe('register', () => {
        it('returns error when email is empty', async () => {
            const result = await register('', 'password123');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Email y contraseña son requeridos');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('returns error when password is empty', async () => {
            const result = await register('test@test.com', '');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Email y contraseña son requeridos');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('returns success on successful registration', async () => {
            const mockResponse = {
                message: 'Usuario registrado exitosamente',
                user: { id: 1, email: 'new@test.com' }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const result = await register('new@test.com', 'password123');

            expect(result.success).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/register'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Usuario',
                        email: 'new@test.com',
                        password: 'password123'
                    })
                })
            );
        });

        it('returns error on failed registration', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'El usuario ya existe' })
            });

            const result = await register('existing@test.com', 'password123');

            expect(result.success).toBe(false);
            expect(result.message).toBe('El usuario ya existe');
        });

        it('returns default error message when no message provided', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({})
            });

            const result = await register('test@test.com', 'password123');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Error al registrarse');
        });
    });

    // ==================
    // GET PROFILE TESTS
    // ==================
    describe('getProfile', () => {
        it('throws error when no token found', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            await expect(getProfile()).rejects.toThrow('No token found');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('returns profile data on success', async () => {
            const mockProfile = { id: 1, email: 'test@test.com', nombre: 'Test User' };
            
            localStorageMock.store['token'] = 'valid-token';
            localStorageMock.getItem.mockReturnValue('valid-token');

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockProfile)
            });

            const result = await getProfile();

            expect(result).toEqual(mockProfile);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/profile'),
                expect.objectContaining({
                    headers: { Authorization: 'Bearer valid-token' }
                })
            );
        });

        it('throws error on failed profile fetch', async () => {
            localStorageMock.store['token'] = 'invalid-token';
            localStorageMock.getItem.mockReturnValue('invalid-token');

            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ message: 'Unauthorized' })
            });

            await expect(getProfile()).rejects.toThrow('Error al obtener perfil');
        });
    });
});
