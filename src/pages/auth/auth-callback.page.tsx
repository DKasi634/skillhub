
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
        }else{
            const timer = setTimeout(()=>{
                navigate("/auth/signin")
            }, 3000);
            
            return ()=>clearTimeout(timer)
        }
    }, [currentUser])

    return <div className="min-h-screen w-full flex items-center justify-center py-4 text-lg font-bold text-black/80">Your email has been confirmed ...</div>;
};

export default AuthCallbackPage;