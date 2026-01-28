import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // 🔁 Si ya está logueado, no debería ver register
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(email, password);

    if (result.success) {
      // 🔄 FLUJO CAMBIADO: Redirigir a Login en lugar de Chat
      navigate("/", {
        state: { message: "Cuenta creada exitosamente. Por favor inicia sesión." }
      });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 px-4">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Crear cuenta en <span className="text-neon-green">Smart</span><span className="text-neon-purple">fin</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Regístrate para comenzar a usar tu asistente financiero
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
              placeholder="usuario@ejemplo.com"
              required
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full flex justify-center py-3 bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90 transition-opacity border-none text-black font-bold"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <div className="text-sm text-center">
              <p className="text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/"
                  className="text-neon-green hover:text-neon-purple transition-colors font-medium"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
