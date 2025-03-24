// components/profile/EditProfileButton.tsx
import { useState } from 'react';
import { Edit } from 'lucide-react';
import EditProfileForm from './edit-profile-form.component';
import { Dialog } from '../dialogs/dialog.component';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/auth.selector';

export const EditProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="edu-button secondary flex items-center gap-2 text-xs font-bold"
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EditProfileForm initialData={{
          name: currentUser.profile?.name || "",
          bio: currentUser.profile?.bio || "",
          ratePerHour: currentUser.profile?.rate_per_hour || 0,
          avatar: currentUser.profile?.profile_image_url || ""
        }} />
      </Dialog>
    </>
  );
};
