import React, { useEffect, useState } from "react";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
import GenericInput from "@/components/generic-input/generic-input.component";
import { nextRouteLocation } from "@/types";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";
import { setErrorToast, setSuccessToast } from "@/store/toast/toast.actions";
import { supabase } from "@/utils/supabase/supabase.config";

const ResetPasswordPage = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ email?: string }>({});
    const currentUser = useSelector(selectCurrentUser);
    const authLoading = useSelector(selectAuthLoading)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const nextLocation: nextRouteLocation = location.state;
    const [sendingResetEmail, setSendingResetEmail] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.user && currentUser.profile) {
            navigate((nextLocation && nextLocation.fromRoute) ? nextLocation.fromRoute : "/me")
        }
    }, [currentUser])

    const showErrorMessage = (message: string) => {
        dispatch(setErrorToast(message))
    }

    const showSuccessMessage = (message: string) => {
        dispatch(setSuccessToast(message))
    }

    const handleNavigateToSignup = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate("/auth/signup", { state: nextLocation })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        let error = "";
        if (!value.trim()) {
            error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            error = "Invalid email format";
        }
        setErrors((prevErrors) => ({ ...prevErrors, email: error }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate all fields
        const emailError = email.trim() ? (!/\S+@\S+\.\S+/.test(email) ? "Invalid email format." : "") : "Email required";
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }
        setSendingResetEmail(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/change-password`
        });
        if (error) {
            showErrorMessage("Could not send email, try again later !");
        } else {
            showSuccessMessage("Email sent , check your inbox or spams !")
        }
        setSendingResetEmail(false);
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
            <div className="w-full max-w-md p-8 space-y-3 lg:rounded-xl bg-white lg:shadow-lg">
                <h2 className="text-2xl font-bold text-center">Reset password</h2> {/* Sign In */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}

                    <GenericInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        error={errors.email}
                        name="email"
                        placeholder=""
                    />

                    <p className="w-full text-xs !mt-4">Don't have an account ? <Link to={"/auth/signup"} onMouseDown={handleNavigateToSignup} className="text-black font-bold px-2 underline-offset-2 underline">Sign up</Link> </p>
                    <p className="w-full text-xs !mt-8">Already have an account ? <Link to={"/auth/signin"} className="text-green font-bold px-2 underline-offset-2 underline">Login</Link> </p>


                    {/* Sign In Button */}
                    <BaseButton
                        type={buttonType.blue} submitType="submit" rounded={false}
                        className="w-full !px-4 !py-2 !text-sm font-medium"
                    >
                        Send email
                    </BaseButton>
                </form>
            </div>

            {(authLoading || sendingResetEmail) && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default ResetPasswordPage;