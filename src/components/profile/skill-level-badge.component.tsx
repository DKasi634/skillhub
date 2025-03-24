// components/profile/SkillLevelBadge.tsx
import { SkillLevel } from "@/api/types";
import { cn } from "@/utils";


interface SkillLevelBadgeProps {
  level: SkillLevel;
}

export const SkillLevelBadge = ({ level }: SkillLevelBadgeProps) => {
  const levelStyles = {
    [SkillLevel.BEGINNER]: 'bg-green-100 text-green-800',
    [SkillLevel.INTERMEDIATE]: 'bg-blue-100 text-blue-800',
    [SkillLevel.ADVANCED]: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        levelStyles[level]
      )}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};
