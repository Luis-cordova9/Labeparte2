// =============================================================================
// COMPONENTE: IMAGE MODAL - Real Estate React
// =============================================================================
// Modal de pantalla completa para visualizar imágenes de propiedades.
// Soporta navegación con teclado y botones, contador de imágenes y cierre.
// =============================================================================

import type React from 'react';
import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  altBase: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Modal de pantalla completa para galería de imágenes.
 *
 * ## Funcionalidades:
 * - Navegación con flechas izquierda/derecha
 * - Cierre con tecla Escape
 * - Cierre al hacer clic en el backdrop
 * - Contador "X de Y"
 * - Botón X para cerrar
 */
export function ImageModal({
  images,
  currentIndex,
  altBase,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps): React.ReactElement {

  // Manejo de teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Evitar que el clic en la imagen cierre el modal
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Cerrar galería"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Contador */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/50 text-white text-sm font-medium">
        {currentIndex + 1} de {images.length}
      </div>

      {/* Flecha izquierda */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Imagen principal */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full mx-16 flex items-center justify-center"
        onClick={handleImageClick}
      >
        <img
          src={images[currentIndex]}
          alt={`${altBase} - Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Flecha derecha */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Miniaturas inferiores (solo si hay más de 1 imagen) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto px-4">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                // Navegar a la imagen clickeada
                if (index > currentIndex) {
                  for (let i = 0; i < index - currentIndex; i++) onNext();
                } else {
                  for (let i = 0; i < currentIndex - index; i++) onPrev();
                }
              }}
              className={`shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={img}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
