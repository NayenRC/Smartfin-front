import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage("Se ha enviado un enlace de recuperación a tu correo.");
        } catch (err) {
            setError(err.message || "Error al enviar el correo de recuperación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full space-y-8 relative z-10 px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">
                        Recuperar Contraseña
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Ingresa tu email para recibir instrucciones
                    </p>
                </div>

                <Card>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
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
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
