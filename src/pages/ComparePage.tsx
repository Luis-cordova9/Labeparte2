import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, X, Trophy } from 'lucide-react';
import type { Property } from '@/types/property';
import { getAllProperties } from '@/lib/storage';

interface ComparePageProps {
  compareIds: string[];
  onRemove: (id: string) => void;
}

function getBest(values: number[], mode: 'min' | 'max'): number {
  return mode === 'min' ? Math.min(...values) : Math.max(...values);
}

export function ComparePage({ compareIds, onRemove }: ComparePageProps) {
  const properties = getAllProperties(); 
  const selected = properties.filter((p) => compareIds.includes(p.id));

  // Empty state
  if (selected.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2Icon className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-2xl font-bold mb-2">Sin propiedades seleccionadas</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Regresa al inicio y presiona "Comparar" en hasta 3 propiedades.
        </p>
        <Button asChild>
          <Link to="/"><Home className="h-4 w-4 mr-2" />Ir al inicio</Link>
        </Button>
      </div>
    );
  }

  // Calcular valores para highlights
  const prices     = selected.map((p) => p.price);
  const areas      = selected.map((p) => p.area ?? 0);
  const bedrooms   = selected.map((p) => p.bedrooms ?? 0);
  const bathrooms  = selected.map((p) => p.bathrooms ?? 0);
  const pricePerSqm = selected.map((p) =>
    p.area ? Math.round(p.price / p.area) : 0
  );

  const bestPrice      = getBest(prices, 'min');
  const bestArea       = getBest(areas, 'max');
  const bestBedrooms   = getBest(bedrooms, 'max');
  const bestBathrooms  = getBest(bathrooms, 'max');
  const bestPricePerSqm = getBest(pricePerSqm, 'min');

  const rows = [
    { label: 'Precio',       values: prices,      best: bestPrice,       mode: 'min' as const, format: (v: number) => `$${v.toLocaleString()}` },
    { label: 'Habitaciones', values: bedrooms,     best: bestBedrooms,    mode: 'max' as const, format: (v: number) => `${v} hab.` },
    { label: 'Baños',        values: bathrooms,    best: bestBathrooms,   mode: 'max' as const, format: (v: number) => `${v} baños` },
    { label: 'Área (m²)',    values: areas,        best: bestArea,        mode: 'max' as const, format: (v: number) => `${v} m²` },
    { label: 'Precio/m²',   values: pricePerSqm,  best: bestPricePerSqm, mode: 'min' as const, format: (v: number) => `$${v.toLocaleString()}/m²` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Comparar Propiedades</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Resaltado = mejor valor en esa categoría
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/"><Home className="h-4 w-4 mr-2" />Volver</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-muted/40">
              {/* Columna de métricas */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                Métrica
              </th>

              {/* Columna por propiedad */}
              {selected.map((p) => (
                <th key={p.id} className="px-4 py-4 text-center border-l">
                  <div className="flex flex-col items-center gap-2">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                    )}
                    <span className="text-sm font-semibold line-clamp-2">{p.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">{p.propertyType}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-7"
                      onClick={() => onRemove(p.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Quitar
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-muted/20 transition-colors">
                {/* Label */}
                <td className="px-4 py-3 text-sm font-semibold text-muted-foreground border-b bg-muted/10">
                  {row.label}
                </td>

                {/* Valores */}
                {row.values.map((value, i) => {
                  const isHighlighted = value === row.best && value !== 0;
                  return (
                    <td
                      key={selected[i].id}
                      className={`px-4 py-3 text-center text-sm font-medium border-b border-l transition-colors ${
                        isHighlighted
                          ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                          : 'text-foreground'
                      }`}
                    >
                      {isHighlighted && (
                        <Trophy className="h-3 w-3 inline mr-1 text-yellow-500" />
                      )}
                      {value !== 0 ? row.format(value) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Icono inline para empty state (evita import extra)
function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}