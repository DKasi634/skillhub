import { IProfile, IUser } from "@/api/types";
import { AuthError } from "@/utils/error.utils";
import { AuthAction } from "./auth.actions";
import { AUTH_ACTION_TYPES } from "./auth.types";

export type AuthState = {
  readonly currentUser:
  { readonly user: IUser | null,
    readonly profile:IProfile|null
  };
  readonly isLoading: boolean;
  readonly error: AuthError | null;
  readonly navigateToSignin: boolean;
  _persistedAt?:number
};

export const authStateInitialValues: AuthState = {
  currentUser: {
    user:null, profile:null
   },
  isLoading: false,
  error: null,
  navigateToSignin: false,
};

export const authReducer = (
  state = authStateInitialValues,
  action: AuthAction | { type: string; payload?: unknown }
): AuthState => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.EMAIL_SIGNIN_START:
    case AUTH_ACTION_TYPES.GOOGLE_SIGNIN_START:
    case AUTH_ACTION_TYPES.REGISTER_START:
    case AUTH_ACTION_TYPES.UPDATE_USER_START:
    case AUTH_ACTION_TYPES.LOGOUT_START:
      return { ...state, isLoading: true };

    case AUTH_ACTION_TYPES.REGISTER_SUCCESS:
      return { ...state, isLoading: false, navigateToSignin: true };
    case AUTH_ACTION_TYPES.CLEAR_NAVIGATE_TO_SIGN_IN:
      return { ...state, navigateToSignin: false };

    case AUTH_ACTION_TYPES.REGISTER_FAILURE:
    case AUTH_ACTION_TYPES.SIGNIN_FAILURE:
    case AUTH_ACTION_TYPES.UPDATE_USER_FAILURE:
    case AUTH_ACTION_TYPES.LOGOUT_FAILURE:
      return { ...state, isLoading: false, error: action.payload as AuthError };

    case AUTH_ACTION_TYPES.SIGNIN_SUCCESS:
      const {user, profile} = action.payload as {user:IUser, profile:IProfile}
      return {
        ...state,
        isLoading: false,
        currentUser: {user, profile},
      };
    case AUTH_ACTION_TYPES.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: {...state.currentUser, profile: action.payload as IProfile},
      };

    case AUTH_ACTION_TYPES.LOGOUT_SUCCESS:
      return {...state, currentUser:{ user:null, profile:null }, isLoading:false, navigateToSignin:false, error:null}

    case AUTH_ACTION_TYPES.CLEAR_AUTH_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};
