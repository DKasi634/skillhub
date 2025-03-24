
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css"
import Toast from "./components/toast/toast.component";
import SignInPage from "./pages/auth/signin.page";
import SignUpPage from "./pages/auth/signup.page";
import useAuth from "./hooks/use-auth.hook";
import AuthProtectedRoute from "./routes/auth-protected.route";
import AuthCallbackPage from "./pages/auth/auth-callback.page";
import ProfilePage from "./pages/profile.page";
import BookingsNavigation from "./routes/bookings.route";
import TeacherSearchPage from "./pages/teacher-search.page";
import NotFoundPage from "./pages/errors/not-found.page";


function App() {

  useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/me"} />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route path="auth/signin" element={<SignInPage />} />
        <Route path="auth/signup" element={<SignUpPage />} />
        <Route path="profile/:userId" element={<ProfilePage />} />
        <Route path="/me" element={<AuthProtectedRoute />}>
          <Route index element={<TeacherSearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsNavigation/>} />
          <Route path="search" element={<TeacherSearchPage/>} />
        </Route>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      <Toast />
    </>
  )
}




export default App;