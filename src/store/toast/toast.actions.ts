import { Action, ActionWithPayload, createAction } from "@/utils/reducer/reducer.utils";

export enum TOAST_ACTION_TYPES {
  SET_TOAST = "toast/SET_TOAST",
  CLEAR_TOAST = "toast/CLEAR_TOAST",
}

export type ToastMessage = {
  message: string;
  type: "success" | "error";
};

type ClearToast = Action<TOAST_ACTION_TYPES.CLEAR_TOAST>;
type SetToast = ActionWithPayload<TOAST_ACTION_TYPES.SET_TOAST, ToastMessage>;

export type ToastAction = ClearToast | SetToast;

export const clearToast = ():ClearToast => createAction(TOAST_ACTION_TYPES.CLEAR_TOAST)
export const setErrorToast = (toastMessage:string):SetToast => createAction(TOAST_ACTION_TYPES.SET_TOAST, {message:toastMessage, type:"error"})
export const setSuccessToast = (toastMessage:string):SetToast => createAction(TOAST_ACTION_TYPES.SET_TOAST, {message:toastMessage, type:"success"})