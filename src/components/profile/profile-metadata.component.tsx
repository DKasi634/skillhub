import { IProfile, IUser, UserRole } from "@/api/types";

// components/profile/ProfileMetaData.tsx
interface ProfileMetaDataProps {
    profile: IProfile;
    user: IUser;
  }
  
  const ProfileMetaData = ({ profile, user }: ProfileMetaDataProps) => (
    <div className="edu-card p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Member Since</label>
          <p className="font-medium">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {user.role === UserRole.TUTOR && (
          <div>
            <label className="text-sm text-gray-500">Last Updated</label>
            <p className="font-medium">
              {new Date(profile.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {user.role === UserRole.LEARNER && profile.skill_level && (
          <div>
            <label className="text-sm text-gray-500">Current Level</label>
            <p className="font-medium capitalize">{profile.skill_level}</p>
          </div>
        )}
      </div>
    </div>
  );

  export default ProfileMetaData