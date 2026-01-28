import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, BookOpen, Menu, Tag, Heart, X, Copy, Check } from "lucide-react";
import Button from "../components/ui/Button";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔐 Cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://smartfin.app/register?ref=" + user?.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-gray-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo + links */}
            <div className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tight text-white mr-10 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <span className="text-neon-green">Smart</span><span className="text-neon-purple">fin</span>
              </span>

              <div className="hidden sm:flex space-x-8">
                <Link
                  to="/dashboard"
                  className="flex items-center text-sm font-medium text-gray-400 hover:text-neon-green transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>

                <Link
                  to="/categories"
                  className="flex items-center text-sm font-medium text-gray-400 hover:text-neon-purple transition-colors"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Categorías
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  SmartChat
                </Link>
              </div>
            </div>

            {/* User + logout */}
            <div className="hidden sm:flex items-center space-x-6">
              <button
                onClick={() => setShowRecommendModal(true)}
                className="text-sm font-medium text-gray-400 hover:text-red-400 transition flex items-center"
              >
                <Heart className="w-4 h-4 mr-1 text-red-500" /> Recomendar
              </button>

              <div className="h-6 w-px bg-gray-800" />

              <span className="text-sm text-gray-300">
                {user?.email}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-white transition"
              >
                Salir
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-border bg-background px-4 py-4 space-y-3 shadow-xl">
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-neon-green"
            >
              Dashboard
            </Link>

            <Link
              to="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-neon-purple"
            >
              Categorías
            </Link>

            <Link
              to="/chat"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-blue-400"
            >
              SmartChat
            </Link>

            <div className="border-t border-gray-800 my-2 pt-2">
              <button
                onClick={() => {
                  setShowRecommendModal(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-base text-gray-300 hover:text-red-400"
              >
                Recomendar a un amigo
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-base text-gray-500 hover:text-white mt-3"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Recommend Modal */}
      {showRecommendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-glow max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowRecommendModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-white">Recomienda Smartfin</h3>
              <p className="text-gray-400 text-sm mt-2">
                Comparte este enlace con tus amigos para que ellos también tomen el control de sus finanzas.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border border-border mb-6">
              <code className="flex-1 text-sm text-neon-green truncate">
                https://smartfin.app/register?ref={user?.id?.slice(0, 8)}...
              </code>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={() => setShowRecommendModal(false)}
              className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold"
            >
              ¡Entendido!
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-gray-600 bg-background">
        <p>© 2024 Smartfin. Tu futuro financiero comienza hoy.</p>
      </footer>
    </div>
  );
};

export default Layout;
