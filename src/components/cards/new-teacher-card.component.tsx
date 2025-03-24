import { useEffect, useState } from "react";
import GenericImage from "../generic-image/generic-image.component";
import { getUserById, getProfileByUserId } from "@/utils/supabase/supabase.utils";
import { IUser, IProfile } from "@/api/types";
import { Bookmark, DollarSign } from "lucide-react";
import AbsoluteLoaderLayout from "../loader/absolute-loader-layout.component";

interface TeacherCardProps {
    className?:string,
    teacherId: string;
    onClick: () => void;
    isSelected: boolean;
}

const NewTeacherCard = ({className="", teacherId, onClick, isSelected }: TeacherCardProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (teacherId) {
            fetchTeacherInfo();
        }
    }, [teacherId]);

    const fetchTeacherInfo = async () => {
        setLoading(true);
        const userData = await getUserById(teacherId);
        const profileData = await getProfileByUserId(teacherId);
        setUser(userData);
        setProfile(profileData);
        setLoading(false);
    };

    return (
        <div className={`${className} relative min-h-40`}>
            {(user && profile) &&
                <div
                    className={`p-4 rounded-xl h-full cursor-pointer transition-all border border-black/30 shadow-sm shadow-black/20 ${isSelected ? "bg-black/10 ring-1 ring-purple-500" : "bg-gray-200/30  hover:bg-black/10"
                        }`}
                    onClick={onClick}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex space-x-3">
                            <div className="w-12 aspect-square rounded-full overflow-hidden">
                                <GenericImage
                                    src={profile.profile_image_url || ""}
                                    alt={profile.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div>
                                <h3 className="text-black font-medium">{profile.name}</h3>
                                <p className="text-gray-800 text-sm">Tutor</p>
                            </div>
                        </div>
                        <Bookmark className="h-5 w-5 text-gray-800" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {profile.subjects.map((subject) => (
                            <span key={subject} className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                                {subject}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-800">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${profile.rate_per_hour}/h
                        </div>
                        <span className="text-gray-800 line-clamp-1">{profile.bio}</span>
                    </div>
                </div>
            }
            {loading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default NewTeacherCard;
