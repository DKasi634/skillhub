import { TOAST_ACTION_TYPES, ToastAction, ToastMessage } from "./toast.actions"



export type ToastState = {
    toast:ToastMessage|null
}
const initialToastValues:ToastState = {
    toast:null
}

export const toastReducer = (state=initialToastValues, action:ToastAction|{type:string, payload?:unknown}):ToastState=>{
    switch(action.type){
        case TOAST_ACTION_TYPES.CLEAR_TOAST:
            return {...state, toast:null}
        case TOAST_ACTION_TYPES.SET_TOAST:
            return {...state, toast:action.payload as ToastMessage}
        default:
            return state
    }
}