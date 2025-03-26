
import React, { useEffect, useRef, useState } from 'react';
import BaseButton from '@/components/buttons/base-button.component';
import GenericInput from '@/components/generic-input/generic-input.component'
import ImageUploadFormGroup from '../images-upload-input/image-upload-input.component';
import { IProfile, UserRole } from '@/api/types';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorToast } from '@/store/toast/toast.actions';
import { selectAuthLoading, selectCurrentUser } from '@/store/auth/auth.selector';
import { updateProfileStart } from '@/store/auth/auth.actions';
interface ProfileFormData {
  className?: string,
  initialProfile: IProfile
}

const EditProfileForm = ({ className = "", initialProfile }: ProfileFormData) => {
  const imageUploadRef = useRef<{
    uploadImages: () => Promise<string[]>;
    hasSelectedImages: () => boolean;
    getAvailableRemoteImages: () => string[]
  }>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const currentAuthLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (canSubmit) {
      console.log("Dispatching update")
      dispatch(updateProfileStart(thisProfile));
      setCanSubmit(false)
    }
  }, [canSubmit]);

  useEffect(() => {
    setIsLoading(currentAuthLoading)
  }, [currentAuthLoading])

  const [thisProfile, setThisProfile] = useState<IProfile>(initialProfile);
  const dispatch = useDispatch();

  const showError = (message: string) => {
    dispatch(setErrorToast(message))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handling submit with loading : ", isLoading);
    try {
      if (isLoading) { return }
      console.log("Checking name !")
      setIsLoading(true);
      if (!thisProfile.name.trim() || thisProfile.name.length <= 4) {
        showError("Name is required. Must have at least 4 charachers"); throw new Error("Error on name")
      }
      if (currentUser && currentUser.user && currentUser.user.role == UserRole.TUTOR && !thisProfile.rate_per_hour) {
        showError("Set a payment rate per hour"); throw new Error("Error on rate per hour")
      }
      console.log("Checked rate !")
      if (imageUploadRef.current?.hasSelectedImages()) {
        console.log("About to upload !")
        const urls = await imageUploadRef.current.uploadImages();
        if (urls.length) { setThisProfile(prev => ({ ...prev, profile_image_url: urls[0] } as IProfile)) }
        console.log("Upload done !");
      }
      setCanSubmit(true);
      console.log("Submit ended !")
    } catch (error) {
      setIsLoading(false);
      console.log("\nError submitting : ", error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} edu-card p-6 space-y-6`}>
      {/* Image Upload Section */}
      <div className="border-b pb-6">
        <ImageUploadFormGroup
          ref={imageUploadRef}
          imagesLimit={1}
          label="Profile Photo"
          folderPath="user-avatars"
          initialImages={thisProfile.profile_image_url ? [thisProfile.profile_image_url] : []}
        />
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <GenericInput
          value={thisProfile.name}
          onChange={(e) => setThisProfile({ ...thisProfile, name: e.target.value })}
          placeholder="John Doe"
          required label={'Full Name'} type={''} name={'full_name'} />

        <GenericInput
          label='Bio'
          type='text'
          name='bio'
          value={thisProfile.bio || ""}
          onChange={(e) => setThisProfile({ ...thisProfile, bio: e.target.value })}
          placeholder=""
        />

        {(currentUser && currentUser.user && currentUser.user.role === UserRole.TUTOR) &&
          <GenericInput
            label="Hourly Rate ($)"
            type="number"
            min="1"
            value={thisProfile.rate_per_hour || 0}
            onChange={(e) => setThisProfile({ ...thisProfile, rate_per_hour: Number(e.target.value) })} name={'h_rate'} />
        }

      </div>

      <BaseButton submitType="submit" className={`${isLoading ? '!cursor-not-allowed opacity-90' : ''}w-full bg-blue-600 hover:bg-blue-700`}>
        {isLoading ? <>Saving...</> : <>Save</>}
      </BaseButton>
    </form>
  );
};

export default EditProfileForm

