
import { Bookmark, DollarSign } from "lucide-react";
import GenericImage from "../generic-image/generic-image.component";

export interface ITeacher {
    id: number;
    name: string;
    role: string;
    hourlyRate: number;
    experience: string;
    skills: string[];
    imageUrl: string;
  }

interface TeacherCardProps {
    teacher: ITeacher;
    onClick: () => void;
    isSelected: boolean;
  }
  
  const TeacherCard = ({ teacher, onClick, isSelected }: TeacherCardProps)=> {
    return (
      <div
        className={`p-4 rounded-xl cursor-pointer transition-all ${
          isSelected ? 'bg-gray-800 ring-2 ring-purple-500' : 'bg-gray-800/50 hover:bg-gray-800'
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex space-x-3">
            <div className="w-12 aspect-square rounded-full overflow-hidden">
              <GenericImage src={teacher.imageUrl}
              alt={teacher.name} className="w-full h-full object-cover object-center" />
            </div>
            
            <div>
              <h3 className="text-white font-medium">{teacher.name}</h3>
              <p className="text-gray-400 text-sm">{teacher.role}</p>
            </div>
          </div>
          <Bookmark className="h-5 w-5 text-gray-400" />
        </div>
  
        <div className="flex flex-wrap gap-2 mb-4">
          {teacher.skills.map(skill => (
            <span
              key={skill}
              className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
  
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <DollarSign className="h-4 w-4 mr-1" />
            ${teacher.hourlyRate}/h
          </div>
          <span className="text-gray-400">{teacher.experience}</span>
        </div>
      </div>
    );
  }

  export default TeacherCard