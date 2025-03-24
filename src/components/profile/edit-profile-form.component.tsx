
import React, { useRef, useState } from 'react';
import BaseButton from '@/components/buttons/base-button.component';
import GenericInput from '@/components/generic-input/generic-input.component'
import ImageUploadFormGroup from '../images-upload-input/image-upload-input.component';
interface ProfileFormData {
  name: string;
  bio: string;
  ratePerHour: number;
  avatar?: string;
}

const EditProfileForm = ({ initialData }: { initialData: ProfileFormData }) => {
  const imageUploadRef = useRef<{
    uploadImages: () => Promise<string[]>;
    hasSelectedImages: () => boolean;
    getAvailableRemoteImages: () => string[]

  }>(null);

  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Handle image upload first
      // let avatarUrl = formData.avatar;
      // if (imageUploadRef.current?.hasSelectedImages()) {
      //   const urls = await imageUploadRef.current.uploadImages();
      //   avatarUrl = urls[0] || '';
      // }

      // Add to handleSubmit function
      // if (imageUploadRef.current?.hasSelectedImages()) {
      //   try {
      //     const urls = await imageUploadRef.current.uploadImages();
      //     if (!urls.length) {
      //       throw new Error('Image upload failed');
      //     }
      //     avatarUrl = urls[0];
      //   } catch (error) {
      //     dispatch(setErrorToast('Failed to upload profile image'));
      //     return;
      //   }
      // }


    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edu-card p-6 space-y-6">
      {/* Image Upload Section */}
      <div className="border-b pb-6">
        <ImageUploadFormGroup
          ref={imageUploadRef}
          imagesLimit={1}
          label="Profile Photo"
          folderPath="user-avatars"
          initialImages={initialData.avatar ? [initialData.avatar] : []}
        />
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <GenericInput
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required label={''} type={''} name={''} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <GenericInput
            label='Describe your teaching experience...'
            type='text'
            name='teaching_description'
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder=""
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
          <GenericInput
            type="number"
            min="10"
            step="5"
            value={formData.ratePerHour}
            onChange={(e) => setFormData({ ...formData, ratePerHour: Number(e.target.value) })} label={''} name={''} />
        </div>
      </div>

      <BaseButton submitType="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Save Profile
      </BaseButton>
    </form>
  );
};

export default EditProfileForm

