
import { ITeacher } from '../cards/teacher-card.component'
import { Share2, Bookmark } from 'lucide-react'
import GenericImage from '../generic-image/generic-image.component'
import DetailSection from '../section/details-section.component'

type TeacherDetailsProps = {
    className?:string,
    selectedTeacher:ITeacher
}

const TeacherDetails = ({className="", selectedTeacher}:TeacherDetailsProps) => {
  return (
    <div className={`${className} w-80 border-l border-gray-800 p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Share2 className="h-5 w-5 text-gray-400" />
                  <Bookmark className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="w-24 aspect-square overflow-hidden rounded-full mx-auto mb-4">
                  <GenericImage
                    src={selectedTeacher.imageUrl}
                    alt={selectedTeacher.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <h3 className="text-white text-xl font-semibold">{selectedTeacher.name}</h3>
                <p className="text-gray-400">{selectedTeacher.role}</p>

                <div className="flex justify-center gap-2 mt-4">
                  {selectedTeacher.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <DetailSection title="Readiness" value="Hired" subvalue="15 years" />
                <DetailSection title="Dialogue" value="Zoom" subvalue="14 October, 2023" />

                <div>
                  <h4 className="text-white mb-2">ITeacher description</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    With a rich tapestry of 15 years in education, I am a seasoned teacher deeply immersed in the world of programming, with Python as my language of choice.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mt-4">
                    My journey is woven with a passion for imparting knowledge, fostering curiosity, and molding the next generation of tech enthusiasts.
                  </p>
                </div>

                <div>
                  <h4 className="text-white mb-2">Hour rate</h4>
                  <p className="text-gray-400">${selectedTeacher.hourlyRate}/h</p>
                </div>

                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Hire teacher
                </button>
              </div>
            </div>
  )
}

export default TeacherDetails