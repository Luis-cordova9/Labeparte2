// =============================================================================
// COMPONENTE: IMAGE GALLERY - Real Estate React
// =============================================================================
// Galería de imágenes con grid de miniaturas que abre un modal al hacer clic.
//
// ## useState para el modal
// Usamos estado local para controlar qué imagen está activa en el modal
// y si el modal está visible o no.
// =============================================================================

import type React from 'react';
import { useState } from 'react';
import { ImageModal } from '@/components/ImageModal';
import { Images } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  /** Texto base para los atributos alt de las imágenes */
  altBase: string;
}

/**
 * Galería de imágenes con miniaturas clickeables y modal de pantalla completa.
 *
 * ## Layout:
 * - 1 imagen: imagen grande centrada
 * - 2 imágenes: dos columnas
 * - 3+ imágenes: imagen principal grande + grid de miniaturas
 */
export function ImageGallery({ images, altBase }: ImageGalleryProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Si no hay imágenes, no renderizamos nada
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg text-muted-foreground gap-2">
        <Images className="h-8 w-8" />
        <span>Sin imágenes disponibles</span>
      </div>
    );
  }

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* ── Grid de miniaturas ── */}
      <div className="space-y-2">

        {/* Imagen principal (siempre visible) */}
        <div
          className="relative cursor-pointer rounded-lg overflow-hidden group"
          onClick={() => openModal(0)}
        >
          <img
            src={images[0]}
            alt={`${altBase} - Imagen principal`}
            className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay con icono al hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full px-4 py-2 text-sm font-medium text-gray-800 flex items-center gap-2">
              <Images className="h-4 w-4" />
              Ver galería
            </div>
          </div>

          {/* Badge con contador total de imágenes */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5" />
              {images.length} fotos
            </div>
          )}
        </div>

        {/* Grid de miniaturas adicionales (solo si hay más de 1) */}
        {images.length > 1 && (
          <div
            className={`grid gap-2 ${
              images.length === 2
                ? 'grid-cols-2'
                : images.length === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-4'
            }`}
          >
            {images.slice(1).map((img, index) => {
              const realIndex = index + 1;
              const isLast = realIndex === images.length - 1 && images.length > 5;
              const remainingCount = images.length - 5;

              return (
                <div
                  key={realIndex}
                  className="relative cursor-pointer rounded-lg overflow-hidden group aspect-video"
                  onClick={() => openModal(realIndex)}
                >
                  <img
                    src={img}
                    alt={`${altBase} - Imagen ${realIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay en la última miniatura si hay más imágenes ocultas */}
                  {isLast && remainingCount > 0 ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">+{remainingCount}</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal de pantalla completa ── */}
      {modalOpen && (
        <ImageModal
          images={images}
          currentIndex={activeIndex}
          altBase={altBase}
          onClose={closeModal}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  );
}
