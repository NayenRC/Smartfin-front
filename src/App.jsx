import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// Carga inmediata para páginas críticas (login/register)
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loading para páginas protegidas (mejora rendimiento inicial)
const Chat = lazy(() => import("./pages/Chat"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Categories = lazy(() => import("./pages/Categories"));
const TelegramRedirect = lazy(() => import("./pages/TelegramRedirect"));

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Componente de carga para Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p>Cargando...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}

        {/* RUTAS PRIVADAS - Con lazy loading */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/chat" element={<Suspense fallback={<PageLoader />}><Chat /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/categories" element={<Suspense fallback={<PageLoader />}><Categories /></Suspense>} />
          <Route path="/telegram" element={<Suspense fallback={<PageLoader />}><TelegramRedirect /></Suspense>} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
