import { UserRole } from "@/api/types";

// components/profile/SubjectsList.tsx
interface SubjectsListProps {
    subjects: string[];
    role: UserRole;
  }
  
  const SubjectsList = ({ subjects=[], role }: SubjectsListProps) => (
    <div className="edu-card p-6">
      <h3 className="text-lg font-semibold mb-4">
        {role === UserRole.TUTOR ? 'Teaching Subjects' : 'Learning Interests'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span key={subject} className="edu-tag">
            {subject}
          </span>
        ))}
        {subjects.length === 0 && (
          <span className="text-gray-500">No subjects specified</span>
        )}
      </div>
    </div>
  );

  export default SubjectsList
  