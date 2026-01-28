import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ExternalLink, MessageCircle } from "lucide-react";
import Card from "../components/ui/Card";

const TelegramRedirect = () => {
    const { user } = useAuth();
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "smartfin_bot";
    const telegramUrl = `https://t.me/${botUsername}`;

    useEffect(() => {
        // Auto-abrir Telegram después de 2 segundos
        const timer = setTimeout(() => {
            window.open(telegramUrl, '_blank');
        }, 2000);

        return () => clearTimeout(timer);
    }, [telegramUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-neon-green/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-lg w-full relative z-10 space-y-6 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-6 bg-neon-green/10 rounded-full border border-neon-green/20">
                        <MessageCircle className="w-16 h-16 text-neon-green" />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent mb-3">
                        ¡Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}!
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Redirigiendo a tu asistente financiero en Telegram...
                    </p>
                </div>

                <Card className="mt-8">
                    <div className="space-y-6 p-6">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <p className="text-sm text-gray-400 mb-4">
                                Si no se abre automáticamente, haz clic aquí:
                            </p>
                            <a
                                href={telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-neon-green/20 text-neon-green border border-neon-green/50 rounded-xl hover:bg-neon-green/30 transition-all font-medium"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Abrir SmartFin Bot</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="text-xs text-gray-500 pt-4">
                            <p>💡 Guarda este enlace para acceder rápidamente:</p>
                            <code className="text-neon-purple">t.me/{botUsername}</code>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TelegramRedirect;
