# 📸 Part 2: Image Gallery

## Descripción

Implementación de una galería de imágenes interactiva para la página de detalle de propiedades. Permite visualizar múltiples imágenes con un modal de pantalla completa, navegación por teclado y contador de imágenes.

---

## Archivos Creados / Modificados

| Archivo | Acción | Descripción |
|---|---|---|
| `src/components/ImageGallery.tsx` | ✅ Creado | Grid de miniaturas clickeables |
| `src/components/ImageModal.tsx` | ✅ Creado | Modal de pantalla completa |
| `src/pages/PropertyDetailPage.tsx` | ✏️ Modificado | Reemplaza imagen simple por galería |

---

## Componentes

### `ImageGallery.tsx`

Componente que renderiza el grid de imágenes dentro de la página de detalle.

**Props:**
```typescript
interface ImageGalleryProps {
  images: string[];   // Array de URLs de imágenes
  altBase: string;    // Texto base para los atributos alt
}
```

**Estado interno:**
```typescript
const [modalOpen, setModalOpen] = useState(false);    // Controla si el modal está visible
const [activeIndex, setActiveIndex] = useState(0);    // Índice de la imagen activa
```

**Comportamiento:**
- Muestra la primera imagen como imagen principal grande
- Renderiza el resto como miniaturas en un grid debajo
- Si hay más de 5 imágenes, la última miniatura muestra `+N` con las restantes
- Al hacer clic en cualquier imagen, abre el modal en esa posición
- Si no hay imágenes, muestra un estado vacío con mensaje

---

### `ImageModal.tsx`

Modal de pantalla completa para visualizar imágenes de forma individual.

**Props:**
```typescript
interface ImageModalProps {
  images: string[];        // Array de URLs de imágenes
  currentIndex: number;    // Índice de la imagen actualmente visible
  altBase: string;         // Texto base para los atributos alt
  onClose: () => void;     // Función para cerrar el modal
  onNext: () => void;      // Función para ir a la siguiente imagen
  onPrev: () => void;      // Función para ir a la imagen anterior
}
```

**Funcionalidades:**
- Escucha eventos de teclado con `useEffect` + `addEventListener`
- Bloquea el scroll del body mientras está abierto (`document.body.style.overflow = 'hidden'`)
- Limpia los event listeners al desmontarse (cleanup en el `return` del `useEffect`)

---

## Flujo de Funcionamiento

```
PropertyDetailPage
  └── <ImageGallery images={images} altBase={property.title} />
        ├── Renderiza imagen principal + grid de miniaturas
        ├── onClick en imagen → setModalOpen(true), setActiveIndex(index)
        └── {modalOpen && <ImageModal ... />}
              ├── onNext → setActiveIndex((prev) => (prev + 1) % images.length)
              ├── onPrev → setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
              └── onClose → setModalOpen(false)
```

---

## Patrón de Diseño: Lifting State Up

El estado (`modalOpen`, `activeIndex`) vive en `ImageGallery`, no en `ImageModal`. Esto sigue el patrón **"lifting state up"** de React:

- `ImageGallery` es el **dueño del estado**
- `ImageModal` es un componente **controlado** — solo recibe props y notifica cambios hacia arriba
- Esto hace que `ImageModal` sea reutilizable y fácil de testear

---

## Definition of Done

| Criterio | Estado |
|---|---|
| Thumbnails grid | ✅ Grid de miniaturas clickeables |
| Modal opens | ✅ Clic en imagen abre modal de pantalla completa |
| Navigation arrows | ✅ Botones izquierda/derecha para navegar |
| Keyboard support | ✅ `←` `→` para navegar, `Escape` para cerrar |
| Image counter | ✅ Muestra "X de Y" en la parte superior |
| Close button | ✅ Botón X en esquina superior derecha |
| Backdrop click | ✅ Clic fuera de la imagen cierra el modal |

---

## Tecnologías Utilizadas

- **React 19** — `useState`, `useEffect`, `useCallback`
- **TypeScript** — tipado estricto con interfaces
- **Tailwind CSS** — estilos y responsive design
- **Lucide React** — iconos (`X`, `ChevronLeft`, `ChevronRight`, `Images`)
- **React Router v7** — navegación entre páginas

## Video de las 2 partes 

https://youtu.be/A06ogxyabw8
