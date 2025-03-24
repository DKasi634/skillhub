import { useEffect, useState } from "react";
import ProfileBioSection from "@/components/profile/profile-bio-section.component";
import { ProfileCompletionProgress } from "@/components/profile/profile-completion-progress.component";
import ProfileHeader from "@/components/profile/profile-header.component";
import ProfileMetaData from "@/components/profile/profile-metadata.component";
import SubjectsList from "@/components/profile/subjects-list.component";
import SubjectsModal from "@/components/modals/subjects-modal.component"; // For tutors editing subjects
import BookingModal from "@/components/modals/booking-modal.component"; // For learners to request sessions
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IProfile, IUser, UserRole } from "@/api/types";
import { getProfileByUserId, getUserById } from "@/utils/supabase/supabase.utils";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";
import { setErrorToast } from "@/store/toast/toast.actions";

const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [thisProfileUser, setThisProfileUser] = useState<IUser | null>(null);
    const [thisProfile, setThisProfile] = useState<IProfile | null>(null);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isStudentViewing, setIsStudentViewing] = useState(false);

    // Modals state
    const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const currentUser = useSelector(selectCurrentUser);
    const currentUserAuthLoading = useSelector(selectAuthLoading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showError = (message:string) =>{
        dispatch(setErrorToast(message))
    }

    useEffect(() => {
        if (currentUser && currentUser.user && currentUser.profile) {
            // If viewing someone else's profile, fetch that user's info
            if (currentUser.user.id !== userId && userId) {
                // console.log("Different users ")
                fetchProfileUser(userId);
                fetchProfile(userId);
            } else {
                // console.log("Same user ! ")
                setIsOwnProfile(true);
                setThisProfileUser(currentUser.user);
                setThisProfile(currentUser.profile);
            }
        }else if((!currentUser || !currentUser.user || !currentUser.profile) && !userId){
            navigate("/auth/signin")
        }
        
    }, [currentUser, userId]);

    useEffect(() => {
        if (thisProfile && subjects !== thisProfile.subjects) {
            setSubjects(thisProfile.subjects);
        }
        // If the current user is a learner, enable the booking modal when viewing another profile
        if (currentUser && currentUser.user && currentUser.user.role === UserRole.LEARNER && thisProfileUser?.role === UserRole.TUTOR) {
            setIsStudentViewing(currentUser.user.id !== userId);
        }
    }, [thisProfile])

    const fetchProfileUser = async (profileUserId: string) => {
        try {
            const user = await getUserById(profileUserId);
            if (user) {setThisProfileUser(user)};
        } catch (error) {
            showError("Error fetching user");
        }
    };

    const fetchProfile = async (profileUserId: string) => {
        try {
            const profile = await getProfileByUserId(profileUserId);
            if (profile) { setThisProfile(profile) };
        } catch (error) {
            showError("Error fetching profile");
        }
    };


    return (
        <div className="relative">
            {(thisProfileUser && thisProfile) && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <ProfileHeader
                        user={thisProfileUser}
                        profile={thisProfile}
                        isOwnProfile={isOwnProfile}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        <div className="lg:col-span-2">
                            <ProfileBioSection bio={thisProfile.bio} editable={isOwnProfile} />

                            {/* Subjects list with an edit option for tutors */}
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Subjects</h2>
                                {(isOwnProfile && thisProfileUser.role === UserRole.TUTOR) && (
                                    <button
                                        onClick={() => setIsSubjectsModalOpen(true)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit Subjects
                                    </button>
                                )}
                            </div>
                            <SubjectsList subjects={subjects} role={thisProfileUser.role} />

                            {/* Booking option for learners viewing a tutor's profile */}
                            {isStudentViewing && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Request a Session
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            {thisProfileUser && (
                                <ProfileMetaData profile={thisProfile} user={thisProfileUser} />
                            )}
                            {isOwnProfile && (
                                <ProfileCompletionProgress
                                    profile={thisProfile}
                                    user={thisProfileUser}
                                />
                            )}
                        </div>
                    </div>

                    {/* Subjects Modal: Available only for tutors editing their own profile */}
                    {(isOwnProfile && thisProfileUser.role === UserRole.TUTOR) && (
                        <SubjectsModal
                            open={isSubjectsModalOpen}
                            onOpenChange={setIsSubjectsModalOpen}
                            selectedSubjects={subjects}
                        />
                    )}
                </div>
            )}

            {/* Booking Modal: Available only when a learner is viewing a tutor's profile */}
            {(isStudentViewing && thisProfile) && (
                <BookingModal
                    tutorProfile={thisProfile}
                    open={isBookingModalOpen}
                    onOpenChange={setIsBookingModalOpen}
                />
            )}

            {(isOwnProfile && currentUserAuthLoading) &&
                <AbsoluteLoaderLayout />
            }
        </div>
    );
};

export default ProfilePage;
