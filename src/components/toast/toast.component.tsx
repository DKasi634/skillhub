import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "@/store/toast/toast.actions";
import { selectToastState } from "@/store/toast/toast.selector";
import styled, { keyframes } from "styled-components";

const Toast: React.FC = () => {
    const dispatch = useDispatch();
    const toastState = useSelector(selectToastState);


    useEffect(() => {
        if (toastState) {
            const timer = setTimeout(() => {
                dispatch(clearToast()); // Clear the toast after the timeout
            }, 5000); // Timeout duration (5 seconds)

            return () => clearTimeout(timer); // Clean up the timer on unmount
        }
    }, [toastState, dispatch]);

    if (!toastState) return null; // Don't render anything if there's no toast message

    const toastClasses =
        toastState.type === "success"
            ? "bg-indigo-700 text-white"
            : "bg-red-500 text-white";

    return (
        <ToastWrapper
            className={`fixed bottom-8 inset-x-0 font-semibold text-sm p-4 w-full flex items-center justify-center z-50`} role="alert" >

            <p className={`p-4 w-full max-w-[20rem] rounded-md shadow-lg ${toastClasses}`}>{toastState.message}</p>
        </ToastWrapper>
    );
};

const slideTop = keyframes`
    from{
        opacity: 0;
        transform: translateY(3rem);
    }
    to{ opacity:1; transform:translateY(0rem) }
`

const ToastWrapper = styled.div`
    animation: ${slideTop} 600ms ease-in-out forwards;
`

export default Toast;