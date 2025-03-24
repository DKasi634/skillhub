import { combineReducers } from "redux"
import { authReducer, AuthState } from "./auth/auth.reducer"
import { toastReducer, ToastState } from "./toast/toast.reducer";

export type RootState = {
    auth:AuthState,
    toast:ToastState
}



export const rootReducer = combineReducers({
    auth:authReducer, 
    toast:toastReducer
});