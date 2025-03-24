import { createSelector } from "reselect";
import { RootState } from "../rootReducer";

const toastSlice = (state:RootState) => state.toast

export const selectToastState = createSelector(
    [toastSlice], slice => slice.toast
)