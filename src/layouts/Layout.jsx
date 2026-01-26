import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, BookOpen, Menu } from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // 🔐 Cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo + links */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white mr-8">
                Smart<span className="text-primary">fin</span>
              </span>

              <div className="hidden sm:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-300 hover:text-white transition"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center text-gray-300 hover:text-white transition"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  ChatBot
                </Link>
              </div>
            </div>

            {/* User + logout */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Hola, {user?.email || "Usuario"}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-border text-sm
                           text-gray-200 hover:bg-primary/10 transition"
              >
                Salir
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-border px-4 py-4 space-y-3">
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/chat"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-white"
            >
              ChatBot
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left text-red-400 hover:text-red-300"
            >
              Salir
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-sm text-gray-500">
        © 2024 Smartfin. Proyecto académico.
      </footer>
    </div>
  );
};

export default Layout;
