import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay sesión de reset (Supabase maneja esto automáticamente)
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                setError("Enlace de recuperación inválido o expirado.");
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setMessage("Contraseña actualizada exitosamente. Redirigiendo...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setError(err.message || "Error al actualizar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full space-y-8 relative z-10 px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
                        Nueva Contraseña
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                <Card>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="password"
                            label="Nueva Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <Input
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        {message && (
                            <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg">
                                <p className="text-sm text-green-400">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full flex justify-center bg-gradient-to-r from-neon-green to-neon-purple text-black font-bold border-none"
                            disabled={loading}
                        >
                            {loading ? "Actualizando..." : "Actualizar Contraseña"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
