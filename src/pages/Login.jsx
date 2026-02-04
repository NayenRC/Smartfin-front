import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login: authLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Mostrar mensaje si viene desde Register
   */
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /**
   * Auto–redirect si ya está logueado
   */
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  /**
   * Submit login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authLogin({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
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
          <h2 className="text-4xl font-extrabold text-white">
            Bienvenid@ a{" "}
            <span className="text-neon-green">Smart</span>
            <span className="text-neon-purple">fin</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Tu asistente financiero inteligente con IA
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

            <Input
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {message && (
              <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg">
                <p className="text-sm text-green-400 font-medium text-center">
                  {message}
                </p>
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
              className="w-full flex justify-center py-3 bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90 transition-opacity border-none text-black font-bold"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </Button>

            <div className="text-sm text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-neon-green hover:text-neon-purple transition-colors font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
