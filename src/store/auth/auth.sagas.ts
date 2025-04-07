import { takeLatest, all, call, put } from "redux-saga/effects";
import { AUTH_ACTION_TYPES } from "./auth.types";
import { ActionWithPayload } from "@/utils/reducer/reducer.utils";

import { IProfile, IUser, UserRole } from "@/api/types";
import {
  logoutFailure,
  logoutStart,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  setCurrentUser,
  signInFailure,
  signInSuccess,
  updateProfileFailure,
  updateProfileSuccess,
} from "./auth.actions";

import { setErrorToast, setSuccessToast } from "../toast/toast.actions";
import { getAuthError } from "@/utils/error.utils";
import {
  createOrUpdateProfile,
  createOrUpdateUser,
  getProfileByUserId,
  getUserByEmail,
} from "@/utils/supabase/supabase.utils";
import {
  supabaseSignInWithEmail,
  supabaseSignOut,
  supabaseSignUp,
} from "@/utils/supabase/supabase.auth";
import {User } from "@supabase/supabase-js";
import { getNewUUID } from "@/utils";

function* registerUser({
  payload: { firstName, lastName, email, password, accountType },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.REGISTER_START,
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: UserRole;
  }
>) {
  try {
    const newAuthUser: User | null = yield call(
      supabaseSignUp,
      email,
      password
    );

    if (!newAuthUser) {
      throw new Error("Either this user already eists or something went wrong !");
    }

    const userToCreate: IUser = {
      id: getNewUUID(),
      email,
      role: accountType,
    };
    const createdUser: IUser | null = yield call(
      createOrUpdateUser,
      userToCreate
    );
    let createdProfile: IProfile | null = null;
    if (createdUser) {
      const newUserProfile: IProfile = {
        id:getNewUUID(),
        user_id: createdUser.id,
        name: `${firstName} ${lastName}`,
        profile_image_url: `https://placehold.co/200x200/207fff/FFF?text=${
          firstName.at(0)?.toUpperCase() || email.at(0)?.toUpperCase()
        }`,
        subjects: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      createdProfile = yield call(
        createOrUpdateProfile,
        createdUser.id,
        newUserProfile
      );
      if (!createdUser || !createdProfile) {
        throw new Error("Failed to register user ");
      }
      yield put(registerSuccess(createdUser));
    }
    yield put(logoutStart());
    yield put(
      setSuccessToast(
        "Sign up successfull ! Check your mail box (or your spams) to active your account."
      )
    );
  } catch (error) {
    yield put(registerFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* emailSignIn({
  payload: { email, password },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.EMAIL_SIGNIN_START,
  { email: string; password: string }
>) {
  try {
    const user: User | null = yield call(
      supabaseSignInWithEmail,
      email,
      password
    );
    if (!user) {
      throw new Error("Signin failed, Invalid credentails !");
    }

    const supabaseUser: IUser | null = yield call(getUserByEmail, email);
    if (!supabaseUser) {
      throw new Error("Oops, Could not find user");
    }
    yield put(setCurrentUser(supabaseUser.email));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* googleSignInComplete({
  payload: { email, displayName, createdAt, photoURL, accountType },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE,
  {
    email: string;
    displayName: string;
    createdAt: Date;
    photoURL: string;
    accountType: UserRole;
  }
>) {

  try {
    if (!email) {
      throw new Error("Signin failed, something went wrong !");
    }
    const existingUser: IUser | null = yield call(getUserByEmail, email);
    // console.log("The existing user : ", existingUser);
    let createdUser: IUser | null = null;
    if (!existingUser) {
      const supabaseUser: IUser = {
        email,
        role: accountType,
        id: getNewUUID(),
      };
      createdUser = yield call(createOrUpdateUser, supabaseUser);
    }
    let createdProfile: IProfile | null = null;
 // console.log("The created user : ", createdUser)
    if (createdUser) {
      // console.log("Created user exists :", createdUser)
      const newUserProfile: IProfile = {
        id:getNewUUID(),
        user_id: createdUser.id,
        name: displayName,
        profile_image_url:
          photoURL ||
          `https://placehold.co/200x200/207fff/FFF?text=${
            displayName.at(0)?.toUpperCase() || email.at(0)?.toUpperCase()
          }`,
        subjects: [],
        created_at: createdAt,
        updated_at: createdAt,
      };
      createdProfile = yield call(
        createOrUpdateProfile,
        createdUser.id,
        newUserProfile
      );
    }
    if (!createdUser || !createdProfile) {
      // console.log("Failed to create user or profile with user : ", createdUser, "\n And profile : ", createdProfile)
      throw new Error("Failed to create user or profile!");
    }
    yield put(setCurrentUser(createdUser.email));
  } catch (error) {
    // console.log("Google sign in failed with : ", error)
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

export function* watchRegistration() {
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER_START, registerUser);
}

export function* watchEmailSignin() {
  yield takeLatest(AUTH_ACTION_TYPES.EMAIL_SIGNIN_START, emailSignIn);
}

export function* watchGoogleSignInCompletion() {
  yield takeLatest(
    AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE,
    googleSignInComplete
  );
}

function* setAuthUser({
  payload: email,
}: ActionWithPayload<AUTH_ACTION_TYPES.SET_CURRENT_USER, string>) {
  try {
    // console.log("\nSETTING CURRENT USER...")
    const thisUser: IUser | null = yield call(getUserByEmail, email);
    let thisUserProfile: IProfile | null = null;
    if (thisUser) {
      thisUserProfile = yield call(getProfileByUserId, thisUser.id);
    }
    if (thisUser && thisUserProfile) {
      yield put(signInSuccess(thisUser, thisUserProfile));
    } else {
      // console.log("\nThis user : ", thisUser, "\n With profile : ", thisUserProfile)
      throw new Error("Something went wrong, no user or profile !");
    }
  } catch (error) {
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* logAuthUserOut() {
  try {
    const loggedOut: boolean = yield call(supabaseSignOut);
    if (loggedOut) {
      yield put(logoutSuccess());
    } else {
      throw new Error("Logout failed !");
    }
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

function* updateProfile({
  payload: profile,
}: ActionWithPayload<AUTH_ACTION_TYPES.UPDATE_USER_START, IProfile>) {
  try {
 // console.log("\nUpdate started , with profile : ", profile)
    const updatedProfile: IProfile | null = yield call(
      createOrUpdateProfile,
      profile.user_id,
      profile
    );
    if (!updatedProfile) {
      throw new Error("Failed to update profile");
    }
    yield put(updateProfileSuccess(updatedProfile));
  } catch (error) {
    yield put(updateProfileFailure(error));
  }
}

export function* watchSetCurrentUser() {
  yield takeLatest(AUTH_ACTION_TYPES.SET_CURRENT_USER, setAuthUser);
}

export function* watchLogout() {
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT_START, logAuthUserOut);
}

export function* watchUserUpdate() {
  yield takeLatest(AUTH_ACTION_TYPES.UPDATE_USER_START, updateProfile);
}

export function* authSaga() {
  yield all([
    call(watchRegistration),
    call(watchEmailSignin),
    call(watchGoogleSignInCompletion),
    call(watchLogout),
    call(watchUserUpdate),
    call(watchSetCurrentUser),
  ]);
}
