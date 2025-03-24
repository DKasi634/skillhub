import { IUser, UserRole } from "@/api/types"
import StudentBookingDashboardPage from "@/pages/student-booking-dashboard.page"
import TutorBookingDashboardPage from "@/pages/tutor-booking-dashboard.page"
import { selectCurrentUser } from "@/store/auth/auth.selector"
import {  useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {  useNavigate } from "react-router-dom"



const BookingsNavigation = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [thisUser, setThisUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setThisUser(currentUser.user)
        }else{
            navigate("auth/signin")
        }
    }, [currentUser])

    return (
        <>
            {thisUser &&
                (<> {thisUser.role === UserRole.TUTOR && <TutorBookingDashboardPage />}
                    {thisUser.role === UserRole.LEARNER && <StudentBookingDashboardPage />}
                </> )
            }
        </>
    )
}

export default BookingsNavigation