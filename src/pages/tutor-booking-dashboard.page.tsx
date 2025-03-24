import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import { getBookingRequestsForTutor, updateBookingRequestStatus } from "@/utils/supabase/supabase.utils";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { BookingStatus, IBookingRequest, IUser, IProfile, UserRole } from "@/api/types";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";

const TutorBookingDashboardPage = () => {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const [tutorUser, setTutorUser] = useState<IUser | null>(null);
    const [tutorProfile, setTutorProfile] = useState<IProfile | null>(null);
    const [bookingRequests, setBookingRequests] = useState<IBookingRequest[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // When currentUser is available, update local tutor states
    useEffect(() => {
        if (currentUser && currentUser.user && currentUser.profile) {
            if (currentUser.user.role !== UserRole.TUTOR) {
                // If the current user is not a tutor, navigate to NotFound page
                navigate("/not-found");
                return;
            }
            setTutorUser(currentUser.user);
            setTutorProfile(currentUser.profile);
        }
    }, [currentUser, navigate]);

    // Fetch booking requests for the tutor
    useEffect(() => {
        const fetchRequests = async () => {
            if (tutorUser) {
                setIsLoading(true);
                const requests = await getBookingRequestsForTutor(tutorUser.id);
                setBookingRequests(requests);
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, [tutorUser]);

    // Handler to update booking request status
    const handleStatusUpdate = async (requestId: string, newStatus: BookingStatus) => {
        setIsLoading(true)
        const updated = await updateBookingRequestStatus(requestId, newStatus);
        setIsLoading(false);
        if (updated) {
            setBookingRequests((prev) =>
                prev ? prev.map((req) => req.id === updated.id ? updated : req ) : prev
            );
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            <div className="max-w-5xl mx-auto p-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold w-full text-left">Tutor Dashboard</h1>
                    {tutorProfile && (
                        <div className="mt-2">
                            <h2 className="text-xl font-semibold w-full text-left">{tutorProfile.name}</h2>
                        </div>
                    )}
                </header>

                <section>
                    <h2 className="text-lg font-semibold text-black/70 mb-4">Booking Requests</h2>
                    {bookingRequests && bookingRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex flex-wrap gap-4">
                            {bookingRequests.map((request) => (
                                <div key={request.id} className="border rounded-lg p-4 shadow-sm shadow-black/30 bg-white w-full lg:max-w-96">
                                    <div className="flex flex-col justify-start gap-2 items-start">
                                        <div className="mb-3">
                                            <p className="font-medium text-sm">
                                                Requested Time: 
                                                <span className="text-gray-700 font-bold">{new Date(request.requested_time).toLocaleString()}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Subject: <span className="font-semibold text-gray-800">{request.subject}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Message: <span className="text-gray-700 font-semibold">{request.message || "No message provided"}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Status: <span className="font-semibold text-gray-800">{request.status}</span>
                                            </p>
                                        </div>
                                        {request.status === BookingStatus.PENDING && (
                                            <div className="flex w-full justify-between items-center gap-6">
                                                <BaseButton
                                                    type={buttonType.blue}
                                                    clickHandler={() => handleStatusUpdate(request.id, BookingStatus.ACCEPTED)}
                                                >
                                                    Accept
                                                </BaseButton>
                                                <BaseButton
                                                    type={buttonType.clear}
                                                    clickHandler={() => handleStatusUpdate(request.id, BookingStatus.REJECTED)}
                                                >
                                                    Reject
                                                </BaseButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No booking requests found.</p>
                    )}
                </section>
            </div>
            { isLoading && <AbsoluteLoaderLayout/> }
        </div>
    );
};

export default TutorBookingDashboardPage;
