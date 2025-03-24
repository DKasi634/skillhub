import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@/components/dialogs/dialog.component";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import { createBookingRequest } from "@/utils/supabase/supabase.utils";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { BookingStatus, IBookingRequest, IProfile } from "@/api/types";
import { setErrorToast } from "@/store/toast/toast.actions";
import { getNewUUID } from "@/utils";

interface BookingModalProps {
    open: boolean;
    tutorProfile: IProfile;
    onOpenChange: (open: boolean) => void;
}

const BookingModal = ({ open, tutorProfile, onOpenChange }: BookingModalProps) => {
    const currentUser = useSelector(selectCurrentUser);
    const [requestedTime, setRequestedTime] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const showError = (message: string) => {
        dispatch(setErrorToast(message))
    }

    const handleSubmit = async () => {
        // Basic validations
        if (!requestedTime) {
            showError("Please select a preferred date and time.");
            return;
        }
        if (!selectedSubject) {
            showError("Please select a subject.");
            return;
        }
        // Additional safeguard: only students can request a session
        if (!currentUser || !currentUser.user || currentUser.user.role !== "LEARNER") {
            showError("Only students can request sessions.");
            return;
        }

        setIsLoading(true);
        const currentDate = new Date().toISOString();
        const newRequest: IBookingRequest = {
            id: getNewUUID(), tutor_id: tutorProfile.user_id,
            student_id: currentUser.user.id, requested_time: requestedTime,
            message: message, subject: selectedSubject, created_at: currentDate,
            updated_at: currentDate, status: BookingStatus.PENDING
        }
        // tutorProfile.user_id is assumed to be the tutor's id.
        const result = await createBookingRequest(newRequest);
        setIsLoading(false);
        if (!result) {
            showError("There was an error creating your booking request. Please try again.");
            return;
        }
        // Close modal on success.
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Request a Session</h2>
                <div>
                    <label className="block font-medium mb-1">Preferred Date & Time</label>
                    <input
                        type="datetime-local"
                        value={requestedTime}
                        onChange={(e) => setRequestedTime(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select a subject</option>
                        {tutorProfile.subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Message (optional)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any additional details..."
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <BaseButton type={buttonType.clear} clickHandler={() => onOpenChange(false)}>
                        Cancel
                    </BaseButton>
                    <BaseButton clickHandler={handleSubmit}>
                        {isLoading ? "Submitting..." : "Submit Request"}
                    </BaseButton>
                </div>
            </div>
        </Dialog>
    );
};

export default BookingModal;
