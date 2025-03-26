import { useEffect, useState } from "react";
import GenericInput from "../generic-input/generic-input.component";

// components/profile/ProfileBioSection.tsx
interface BioSectionProps {
    bio?: string;
  }
  
  const ProfileBioSection = ({ bio}: BioSectionProps) => {
    const [editedBio, setEditedBio] = useState('');

    useEffect(()=>{
      if(bio){
        setEditedBio(bio)
      }
    }, [bio])
    
  
    return (
      <div className="edu-card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">About Me</h2>
        </div>

          <GenericInput
          readOnly={true}
          disabled
          type="text"
          label="Your Bio"
          name="description"
            value={editedBio ||"No bio available"}
            onChange={(e) => setEditedBio(e.target.value)}
            placeholder=""
          />
        
      </div>
    );
  };

export default ProfileBioSection;
  