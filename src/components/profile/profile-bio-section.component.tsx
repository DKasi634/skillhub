import { useState, useCallback } from "react";
import { EditButton } from "./edit-button.component";
import GenericInput from "../generic-input/generic-input.component";

// components/profile/ProfileBioSection.tsx
interface BioSectionProps {
    bio?: string;
    editable: boolean;
  }
  
  const ProfileBioSection = ({ bio, editable=false }: BioSectionProps) => {
    const [editedBio, setEditedBio] = useState(bio || '');
    
    const handleSave = useCallback(() => {
      // Dispatch Redux action to update bio
    }, []);
  
    return (
      <div className="edu-card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">About Me</h2>
          {editable && <EditButton onClick={handleSave} />}
        </div>
        {editable ? (
          <GenericInput
          readOnly={!editable}
          type="text"
          label="Describe your teaching/learning approach"
          name="description"
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            placeholder=""
          />
        ) : (
          <p className="text-gray-600">{bio || 'No bio available'}</p>
        )}
      </div>
    );
  };

export default ProfileBioSection;
  