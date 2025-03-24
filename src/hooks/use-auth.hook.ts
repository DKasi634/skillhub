import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase.config";
import { useDispatch, useSelector } from "react-redux";
import { googleSignInComplete, setCurrentUser } from "@/store/auth/auth.actions";
import {
  getUserByEmail,
} from "@/utils/supabase/supabase.utils";
import { getSessionStorageAuthState } from "@/utils/supabase/supabase.auth";
import { Session } from "@supabase/supabase-js";
import { selectCurrentUser } from "@/store/auth/auth.selector";
// import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const urlParams = new URLSearchParams(window.location.search);
  const state = urlParams.get("state");
  const authParamsState = state ? getSessionStorageAuthState(state) : null;
  const [isHandlingSession, setIsHandlingSession] = useState(false);

  useEffect(() => {
    if(currentUser && currentUser.user && currentUser.profile){ 
      return
     }

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        // console.log("Auth event : ", _, "\n With session : ", session);
        if (session?.user) {
          handleSession(session);
        }
      }
    );

    // checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  // Shared logic for handling the session
  const handleSession = async (session: Session) => {
    if(isHandlingSession){ return };
    setIsHandlingSession(true);
    const { user } = session;

    if (user && user.email) {
      const existingDBUser = await getUserByEmail(user.email);
      // console.log( "Existing user : ", existingDBUser, "\nAnd auth params : ", authParamsState);
      if(existingDBUser){ dispatch(setCurrentUser(existingDBUser.email));return }
      else if (!existingDBUser && authParamsState) {
        dispatch(googleSignInComplete(user, authParamsState.accountType));return
      }
    }
    setIsHandlingSession(false)
  };
};

export default useAuth;
