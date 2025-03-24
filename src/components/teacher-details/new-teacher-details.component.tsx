import { useEffect, useState } from "react";
// import LoaderItem from "@/components/loader/loader.component";
import GenericImage from "@/components/generic-image/generic-image.component";
import { getUserById, getProfileByUserId } from "@/utils/supabase/supabase.utils";
import { IUser, IProfile, UserRole } from "@/api/types";
import AbsoluteLoaderLayout from "../loader/absolute-loader-layout.component";
import BaseButton from "../buttons/base-button.component";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";

interface TeacherDetailsProps {
    className?: string,
    teacherId: string;
}

const TeacherDetails = ({ teacherId, className = "" }: TeacherDetailsProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const userData = await getUserById(teacherId);
            const profileData = await getProfileByUserId(teacherId);
            setUser(userData);
            setProfile(profileData);
            setLoading(false);
        };
        fetchDetails();
    }, [teacherId]);

    return (
        <div className={`${className} relative p-4 `}>
            {(user && profile) &&
                <div className="text-black h-full flex flex-col items-start gap-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <GenericImage
                                src={profile.profile_image_url || ""}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{profile.name}</h2>
                            <p className="text-gray-800">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 w-full">
                        <p className="mb-2">
                            <span className="font-semibold">Bio:</span> {profile.bio || "No bio provided"}
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">Subjects:</span> {profile.subjects.join(", ")}
                        </p>
                        {profile.rate_per_hour && (
                            <p className="mb-2">
                                <span className="font-semibold">Hourly Rate:</span> ${profile.rate_per_hour}
                            </p>
                        )}
                    </div>
                    {/* Add any additional details as needed */}
                    {(currentUser && currentUser.user && currentUser.user.role === UserRole.LEARNER) &&
                        <BaseButton href={`/profile/${teacherId}`} rounded={false} className="mx-auto !w-full ">Hire</BaseButton>
                    }
                </div>}
            {loading && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default TeacherDetails;
