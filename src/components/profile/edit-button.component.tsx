// components/common/EditButton.tsx
import { Edit } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  label?: string;
}

export const EditButton = ({ onClick, label = 'Edit' }: EditButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-edu-primary hover:text-edu-accent transition-colors"
  >
    <Edit className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);
