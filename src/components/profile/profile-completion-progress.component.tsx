// components/profile/ProfileCompletionProgress.tsx
import { IProfile, IUser, UserRole } from "@/api/types";

interface ProfileCompletionProps {
  profile: IProfile;
  user:IUser
}

const REQUIRED_FIELDS: (keyof IProfile)[] = [
  'name',
  'bio',
  'subjects',
  'profile_image_url',
  'rate_per_hour' // Only required for tutors
];

export const ProfileCompletionProgress = ({ profile, user }: ProfileCompletionProps) => {
  const calculateCompletion = () => {
    const total = REQUIRED_FIELDS.filter(field => 
      field !== 'rate_per_hour' || user?.role === UserRole.TUTOR
    ).length;
    
    const completed = REQUIRED_FIELDS.filter(field => {
      if (field === 'rate_per_hour' && user?.role !== UserRole.TUTOR) return false;
      return !!profile[field];
    }).length;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  return (
    <div className="edu-card p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Profile Completion</span>
        <span className="text-sm text-edu-primary">{completion}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-edu-primary rounded-full h-2 transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
};
