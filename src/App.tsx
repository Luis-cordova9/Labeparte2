// =============================================================================
// APP COMPONENT - Module 2: Real Estate React
// =============================================================================
// Componente raíz de la aplicación que configura:
// - Routing con React Router
// - Layout general
// - Providers globales (si los hubiera)
//
// ## React Router v7
// React Router es el estándar para routing en aplicaciones React.
// Usamos Routes y Route para definir las páginas de la aplicación.
// =============================================================================
import { useState } from 'react';
import type React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Home, Building2, GitCompare } from 'lucide-react';
import { HomePage } from '@/pages/HomePage';
import { NewPropertyPage } from '@/pages/NewPropertyPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { ComparePage } from '@/pages/ComparePage';

function App(): React.ReactElement {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)   // quitar
        : prev.length < 3
          ? [...prev, id]                // agregar (si hay espacio)
          : prev                         // ignorar si ya hay 3
    );
  };

  const handleRemoveCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((i) => i !== id));
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen flex flex-col bg-background">
        {/* HEADER */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Building2 className="h-6 w-6 text-primary" />
              <span>RealEstate</span>
            </Link>

            <nav className="ml-auto flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>

              {/* Link a comparar - muestra contador si hay seleccionadas */}
              <Link
                to="/compare"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitCompare className="h-4 w-4" />
                Comparar
                {compareIds.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {compareIds.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  compareIds={compareIds}
                  onToggleCompare={handleToggleCompare}
                />
              }
            />
            <Route path="/new" element={<NewPropertyPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* Nueva ruta de comparación */}
            <Route
              path="/compare"
              element={
                <ComparePage
                  compareIds={compareIds}
                  onRemove={handleRemoveCompare}
                />
              }
            />

            <Route
              path="*"
              element={
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-muted-foreground mb-6">Página no encontrada</p>
                  <Link to="/" className="text-primary hover:underline">
                    Volver al inicio
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="border-t py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Portal Inmobiliario - Módulo 2 del Curso de Desarrollo Web</p>
            <p className="mt-1">Desarrollado con React 19, Tailwind CSS y Shadcn UI</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;