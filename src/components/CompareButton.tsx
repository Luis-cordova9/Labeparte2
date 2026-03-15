import { Button } from '@/components/ui/button';

interface CompareButtonProps {
  propertyId: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function CompareButton({ propertyId, selectedIds, onToggle }: CompareButtonProps) {
  const isSelected = selectedIds.includes(propertyId);
  const isDisabled = !isSelected && selectedIds.length >= 3;

  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      disabled={isDisabled}
      onClick={() => onToggle(propertyId)}
      title={isDisabled ? 'Máximo 3 propiedades' : ''}
    >
      {isSelected ? '✓ Comparando' : 'Comparar'}
    </Button>
  );
}