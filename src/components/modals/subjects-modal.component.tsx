import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../dialogs/dialog.component";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import GenericInput from "@/components/generic-input/generic-input.component";
import { HiddenScrollbarWrapper } from "@/globals/styles";
import { LiaTimesSolid } from "@/assets";
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
import { IProfile, UserRole } from "@/api/types";
import { setErrorToast } from "@/store/toast/toast.actions";
import { updateProfileStart } from "@/store/auth/auth.actions";

interface SubjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubjects: string[];
}

const SubjectsModal = ({ open, onOpenChange, selectedSubjects }: SubjectsModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSubjects, setLocalSubjects] = useState<string[]>(selectedSubjects);
  const currentUserLoading = useSelector(selectAuthLoading);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const currentUser = useSelector(selectCurrentUser);

  useEffect(()=>{
    setIsLoading(currentUserLoading)
  }, [currentUserLoading])

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Computer Science', 'History'
  ].filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !localSubjects.includes(subject)
  );

  const showError = (message: string) => {
        dispatch(setErrorToast(message))
    }
  const handleSubjectSelect = (subject: string) => {
    setLocalSubjects(prev => [...prev, subject]);
    setSearchQuery('');
  };

  const handleSubjectRemove = (subject: string) => {
    setLocalSubjects(prev => prev.filter(s => s !== subject));
  };

  const handleSave = async () => {
    // Basic validation: ensure at least one subject is selected
    if (localSubjects.length === 0) {
      showError("Please select at least one subject.");
      return;
    }
    // Additional safeguard: Only tutors can update their subjects.
    if (!currentUser || !currentUser.user || currentUser.user.role !== UserRole.TUTOR) {
      showError("Only tutors can update subjects.");
      return;
    }
    dispatch(updateProfileStart({...currentUser.profile, subjects:localSubjects} as IProfile))
    // setIsLoading(true);
    // const updatedProfile = await updateTutorSubjects(currentUser.user.id, localSubjects);
    // setIsLoading(false);
    // if (!updatedProfile) {
    //   showError("Failed to update subjects. Please try again.");
    //   return;
    // }
    onOpenChange(false);
  };

  return (
    <Dialog className="z-40" open={open} onOpenChange={onOpenChange}>
      <div className="py-4">
        <GenericInput
          label="Search Subjects"
          type="text"
          value={searchQuery}
          name="searchQuery"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects..."
        />
      </div>
      <HiddenScrollbarWrapper className="bg-white rounded-lg p-6 w-full max-w-md max-h-72 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          {/* Selected Subjects */}
          <div className="space-y-2">
            <h3 className="font-medium">Selected ({localSubjects.length})</h3>
            {localSubjects.map(subject => (
              <div
                key={subject}
                className="flex items-center justify-between p-3 gap-4 border rounded-lg max-w-min"
              >
                <span>{subject}</span>
                <BaseButton
                  className="!px-2 !py-[0.2rem]"
                  rounded={false}
                  type={buttonType.dark}
                  clickHandler={() => handleSubjectRemove(subject)}
                >
                  <LiaTimesSolid className="text-xl" />
                </BaseButton>
              </div>
            ))}
          </div>
          {/* Available Subjects */}
          <div className="space-y-2">
            <h3 className="font-medium">Available</h3>
            {availableSubjects.map(subject => (
              <BaseButton
                key={subject}
                type={buttonType.blue}
                rounded={false}
                className="w-full justify-start !text-sm"
                clickHandler={() => handleSubjectSelect(subject)}
              >
                {subject}
              </BaseButton>
            ))}
          </div>
        </div>
      </HiddenScrollbarWrapper>
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <BaseButton type={buttonType.clear} clickHandler={() => onOpenChange(false)}>
          Cancel
        </BaseButton>
        <BaseButton clickHandler={handleSave}>
          {isLoading ? "Saving..." : "Save Changes"}
        </BaseButton>
      </div>
    </Dialog>
  );
};

export default SubjectsModal;
