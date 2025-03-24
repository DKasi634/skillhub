// components/profile/ProfileHeader.tsx
import { IProfile, IUser, UserRole } from "@/api/types";
import { CurrencyDollarIcon } from "@heroicons/react/16/solid";
import { EditProfileButton } from "./edit-profile-button.component";
import { SkillLevelBadge } from "./skill-level-badge.component";
import GenericImage from "../generic-image/generic-image.component";
import BaseButton, { buttonType } from "../buttons/base-button.component";
import { FiLogOut } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { logoutStart } from "@/store/auth/auth.actions";

interface ProfileHeaderProps {
    user: IUser;
    profile: IProfile;
    isOwnProfile: boolean;
}

const ProfileHeader = ({ user, profile, isOwnProfile }: ProfileHeaderProps) => {
        const currentUser = useSelector(selectCurrentUser);
        const dispatch = useDispatch();

        const handleLogout = ()=>{
            dispatch(logoutStart())
        }
        return (
    <div className="flex items-start gap-6 edu-card p-6">
        {profile.profile_image_url && (
            <div className="w-28 aspect-square rounded-full overflow-hidden border-2 border-edu-primary/50">
                <GenericImage
                    src={profile.profile_image_url}
                    className="w-full h-full object-center object-cover"
                    alt="Profile avatar"
                />
            </div>
        )}
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div className="flex flex-col items-start justify-start gap-2">
                    <h1 className="text-xl lg:text-2xl font-bold">{profile.name}</h1>
                    <p className="text-black/60 font-bold mt-2">{user.role}</p>
                    {(isOwnProfile && currentUser && currentUser.user?.id === user.id) && <BaseButton clickHandler={handleLogout} type={buttonType.clear} className="edu-button space-x-4"><FiLogOut/> <span className="hidden md:inline-block">Logout</span> </BaseButton>}
                </div>
                {isOwnProfile && <EditProfileButton />}
            </div>

            <div className="mt-4 flex gap-4 items-center">
                {user.role === UserRole.TUTOR && profile.rate_per_hour && (
                    <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        <span>${profile.rate_per_hour}/hour</span>
                    </div>
                )}
                {user.role === UserRole.LEARNER && profile.skill_level && (
                    <SkillLevelBadge level={profile.skill_level} />
                )}
            </div>
        </div>
    </div>
)}

;

export default ProfileHeader;
