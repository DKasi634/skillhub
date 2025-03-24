import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase.config";
import { UserRole } from "@/api/types";
import { getNewUUID } from "..";

export const supabaseSignUp = async (
  email: string,
  password: string
): Promise<User | null> => {
  console.log(
    `Starting signup with email : ${email} and password : ${password}`
  );
  try {
    const { data, error } = await supabase.auth.signUp({ email, password, options:{
      emailRedirectTo:`https://skillhub-web.netlify.app/callback`
    } });

    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  } catch (error) {
    console.log("Error signing up : ", error);
    return null;
  }
};

export const supabaseSignInWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  // We should not rely on a returned user here, since we'll be catching them from the auth state changed listener
  console.log("Signing in with email: ", email, " and pwd : ", password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error.message);
    return null;
  } else {
    console.log("Signed in successfully with user : ", data.user);
    return data.user;
  }
};

export const supabaseSignOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export type GoogleAuthParams = {
  accountType: UserRole;
  timeStamp: Date;
};

export const getSessionStorageAuthState = (
  stateUid: string
): GoogleAuthParams | null => {
  // console.log("Getting params with state Uid : ", stateUid);
  const authSessionState = sessionStorage.getItem(`oauth_${stateUid}`);
  return authSessionState ? JSON.parse(authSessionState) : null;
};

export const supabaseGoogleSignIn = async (accountType?: UserRole) => {
  try {
    const stateUid = getNewUUID();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback${`?state=${stateUid}`}`, // Redirect to your app's callback
      },
    });

    if (accountType) {
      sessionStorage.setItem(
        `oauth_${stateUid}`,
        JSON.stringify({ accountType, timeStamp: Date.now() })
      );
    }
  } catch (error) {
    // console.log("Error signing with Google : ", error)
  }
};
