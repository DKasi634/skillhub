import { createSelector } from "reselect";
import { RootState } from "../rootReducer";

const authSlice = (state: RootState) => state.auth;

export const selectCurrentUser = createSelector(
  [authSlice],
  (slice) => slice.currentUser
);

export const selectProfile = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser?.profile
);

export const selectAuthError = createSelector(
  [authSlice],
  (slice) => slice.error
);

export const selectAuthLoading = createSelector(
  [authSlice],
  (slice) => slice.isLoading
);


export const selectNavigateToSignIn = createSelector(
  [authSlice], (slice)=> slice.navigateToSignin
)


