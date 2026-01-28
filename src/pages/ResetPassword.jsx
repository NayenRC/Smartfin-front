import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { showSuccess, showError } from "../utils/toast";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar sesión y tokens en la URL
        const checkSession = async () => {
            console.log("🔍 Verificando sesión para reset...");

            // 1. Obtener sesión actual
            const { data, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("❌ Error de sesión:", sessionError);
                showError("Error al verificar la sesión.");
                return;
            }

            if (data.session) {
                console.log("✅ Sesión detectada:", data.session.user.email);
            } else {
                console.warn("⚠️ No se detectó sesión activa.");

                // Si no hay sesión, verificamos si hay tokens en la URL (algunos navegadores limpian el hash rápido)
                const hasHash = window.location.hash.includes('access_token');
                if (!hasHash) {
                    showError("El enlace de recuperación parece inválido o ha expirado.");
                    setError("El enlace de recuperación es inválido o expiró. Por favor solicita uno nuevo.");
                }
            }
        };

        checkSession();

        // Escuchar cambios de auth por si el hash se procesa después
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("🔔 Auth Event:", event);
            if (event === "PASSWORD_RECOVERY") {
                console.log("🎯 Modo recuperación de contraseña activado");
                setError(""); // Limpiar errores previos si entramos en modo recovery
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            showError("Las contraseñas no coinciden.");
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            showError("La contraseña debe tener al menos 6 caracteres.");
            setError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            showSuccess("Contraseña actualizada exitosamente.");
            setMessage("Contraseña actualizada exitosamente. Redirigiendo...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            showError(err.message || "Error al actualizar la contraseña.");
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
