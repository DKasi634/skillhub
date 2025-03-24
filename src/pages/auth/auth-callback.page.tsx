
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);

    useEffect(()=>{
        if(currentUser && currentUser.user && currentUser.profile){
            navigate("/")
        }
    }, [currentUser])

    return <div className="min-h-screen w-full flex items-center justify-center py-4 text-lg font-bold text-black/80">Authenticating...</div>;
};

export default AuthCallbackPage;