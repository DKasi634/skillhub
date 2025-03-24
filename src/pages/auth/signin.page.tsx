import React, { useEffect, useState } from "react";
import PasswordInput from "@/components/generic-input/password-input.component";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { emailSignInStart } from "@/store/auth/auth.actions";
import { selectAuthLoading, selectCurrentUser } from "@/store/auth/auth.selector";
// import GoogleSigninButton from "@/components/base-button/google-button.component";
import GenericInput from "@/components/generic-input/generic-input.component";
import { nextRouteLocation } from "@/types";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";

const SignInPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const currentUser = useSelector(selectCurrentUser);
  const authLoading = useSelector(selectAuthLoading)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const nextLocation:nextRouteLocation = location.state;

  useEffect(()=>{
    if(currentUser && currentUser.user && currentUser.profile){
      navigate( (nextLocation && nextLocation.fromRoute) ? nextLocation.fromRoute :  "/me")
    }
  }, [currentUser])

  const handleNavigateToSignup = (e:React.MouseEvent<HTMLAnchorElement>) =>{
    e.preventDefault();
    navigate("/auth/signup", { state:nextLocation })
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

  // Handle password input change and validate
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    let error = "";
    if (!value.trim()) {
      error = "Password is required";
    } else if (value.length < 6) {
      error = "Password must be at least 6 characters"; 
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: error }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailError = email.trim() ? (!/\S+@\S+\.\S+/.test(email) ? "Invalid email format." : "") : "Email required";
    const passwordError = password.trim() ? (password.length < 6 ? "Password must have at least 6 characters" : "") : "Password required";

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    dispatch(emailSignInStart(email, password))
    
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <div className="w-full max-w-md p-8 space-y-3 lg:rounded-xl bg-white lg:shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign in</h2> {/* Sign In */}
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

          {/* Password Input (Replaced with PasswordInput component) */}
          <PasswordInput
            label="Password" 
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
          />

          <p className="w-full text-xs !mt-8">Don't have an account ? <Link to={"/auth/signup"} onMouseDown={handleNavigateToSignup} className="text-green font-bold px-2 underline-offset-2 underline">Sign up</Link> </p>

          {/* Sign In Button */}
          <BaseButton
            type={buttonType.blue} submitType="submit" rounded={false}
            className="w-full !px-4 !py-2 !text-sm font-medium"
          >
            Sign in {/* Sign In */
            }
          </BaseButton>

          {/* Continue with Google Button */}
          {/* <GoogleSigninButton/> */}
        </form>
      </div>

      {authLoading && <AbsoluteLoaderLayout/> }
    </div>
  );
};

export default SignInPage;