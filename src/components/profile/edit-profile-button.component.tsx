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
      {(currentUser && currentUser.profile && currentUser.user) &&
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EditProfileForm initialProfile={currentUser.profile} />
      </Dialog>
      }
    </>
  );
};
