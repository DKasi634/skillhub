import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import { getBookingRequestsForStudent, updateBookingRequestStatus } from "@/utils/supabase/supabase.utils";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { BookingStatus, IBookingRequest, IUser, IProfile, UserRole } from "@/api/types";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";

const StudentBookingDashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [studentUser, setStudentUser] = useState<IUser | null>(null);
  const [studentProfile, setStudentProfile] = useState<IProfile | null>(null);
  const [bookingRequests, setBookingRequests] = useState<IBookingRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // When currentUser is available, update local student states
  useEffect(() => {
    if (currentUser && currentUser.user && currentUser.profile) {
      if (currentUser.user.role !== UserRole.LEARNER) {
        // If the current user is not a learner, navigate to NotFound page
        navigate("/not-found");
        return;
      }
      setStudentUser(currentUser.user);
      setStudentProfile(currentUser.profile);
    }
  }, [currentUser, navigate]);

  // Fetch booking requests for the student
  useEffect(() => {
    const fetchRequests = async () => {
      if (studentUser) {
        setIsLoading(true);
        const requests = await getBookingRequestsForStudent(studentUser.id);
        setBookingRequests(requests);
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [studentUser]);

  // Handler to update booking request status (for cancel)
  const handleCancelRequest = async (requestId: string) => {
    setIsLoading(true);
    const updated = await updateBookingRequestStatus(requestId, BookingStatus.CANCELLED);
    setIsLoading(false);
    if (updated) {
      setBookingRequests((prev) =>
        prev ? prev.map((req) => (req.id === updated.id ? updated : req)) : prev
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold w-full text-left">My Session Requests</h1>
          {studentProfile && (
            <div className="mt-2">
              <h2 className="text-xl font-semibold w-full text-left">Hello, {studentProfile.name}</h2>
            </div>
          )}
        </header>

        <section>
          <h2 className="text-lg font-semibold text-black/70 mb-4">Booking Requests</h2>
          {bookingRequests && bookingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex flex-wrap gap-4">
              {bookingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 shadow-sm bg-white w-full lg:max-w-96">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">
                      <span className="font-medium">Requested Time:</span>{" "}
                      <span className="text-gray-700 font-bold">{new Date(request.requested_time).toLocaleString()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Subject:</span>{" "}
                      <span className="font-semibold text-gray-800">{request.subject || "N/A"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Message:</span>{" "}
                      <span className="text-gray-700 font-semibold">{request.message || "No message provided"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="font-semibold text-gray-800">{request.status}</span>
                    </p>
                    {request.status === BookingStatus.PENDING && (
                      <div className="mt-2">
                        <BaseButton
                          type={buttonType.clear}
                          clickHandler={() => handleCancelRequest(request.id)}
                        >
                          Cancel Request
                        </BaseButton>
                      </div>
                    )}
                    {request.status === BookingStatus.ACCEPTED && (
                      <div className="mt-2">
                        <BaseButton
                          href={`/me/session-payment?requestId=${request.id}&tutorId=${request.tutor_id}&subject=${request.subject}&amount=35`}
                        >
                          Pay & Confirm
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
      {isLoading && <AbsoluteLoaderLayout />}
    </div>
  );
};

export default StudentBookingDashboardPage;
