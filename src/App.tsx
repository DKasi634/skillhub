
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css"
import Toast from "./components/toast/toast.component";
import SignInPage from "./pages/auth/signin.page";
import SignUpPage from "./pages/auth/signup.page";
import useAuth from "./hooks/use-auth.hook";
import AuthCallbackPage from "./pages/auth/auth-callback.page";
import ProfilePage from "./pages/profile.page";
import BookingsNavigation from "./routes/bookings.route";
import TeacherSearchPage from "./pages/teacher-search.page";
import NotFoundPage from "./pages/errors/not-found.page";
import BaseNavigation from "./routes/base-navigation.route";
import TutoringSessionPaymentPage from "./pages/tutor-session-payment.page";
import ChangePasswordPage from "./pages/auth/change-password.page";
import ResetPasswordPage from "./pages/auth/reset-password.page";


function App() {

  useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/me"} />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route path="auth/signin" element={<SignInPage />} />
        <Route path="auth/signup" element={<SignUpPage />} />
        <Route path="auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="auth/change-password" element={<ChangePasswordPage />} />
        <Route path="profile/:userId" element={<ProfilePage />} />
        <Route path="me" element={<BaseNavigation />}>
          <Route index element={<TeacherSearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsNavigation/>} />
          <Route path="search" element={<TeacherSearchPage/>} />
          <Route path="session-payment" element={<TutoringSessionPaymentPage/>} />
        </Route>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      <Toast />
    </>
  )
}




export default App;