import GenericImage from "@/components/generic-image/generic-image.component"
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, Outlet, useNavigate } from "react-router-dom"


const BaseNavigation = () => {
    const currentUser = useSelector(selectCurrentUser);
    const authLoading = useSelector(selectAuthLoading);
    const [userFound, setUserFound] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!authLoading && (!currentUser || !currentUser.user || !currentUser.profile)){
            setUserFound(false)
        }
    }, [authLoading, currentUser]);

    useEffect(()=>{
        if(!userFound){
            navigate("/auth/signin")
        }
    }, [userFound])

    return (
        <>
            {currentUser.user && (
                <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-white p-8 relative">
                    <div className="max-w-7xl mx-auto bg-white backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <header className="px-8 py-4 border-b border-gray-300 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-black">
                                <span className="text-xl font-semibold">SkillHub</span>
                            </div>

                            <nav className="flex items-center justify-center gap-4">
                                <Link to="/" className="text-black hover:underline">Home</Link>
                                <Link to="/me/bookings" className="text-black hover:underline">My Requests</Link>
                                {/* <Link to="/teachers" className="text-black hover:underline">My Teachers</Link> */}
                            </nav>

                            <div className="flex items-center space-x-4">
                                <Link to={`/me/profile`} className="w-8 aspect-square overflow-hidden rounded-full">
                                    <GenericImage
                                        src={currentUser.profile?.profile_image_url || ""}
                                        className="w-full h-full object-cover"
                                        alt={currentUser.profile?.name || "Profile"}
                                    />
                                </Link>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="min-h-screen w-full h-full">
                            <Outlet />
                        </main>
                    </div>
                </div>
            )}
        </>
    )
}

export default BaseNavigation