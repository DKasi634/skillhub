// import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/auth.selector';

// interface AuthProtectedRouteProps {
//   children: ReactNode;
// }

const AuthProtectedRoute = () => {
    const currentUser = useSelector(selectCurrentUser);
  return (currentUser.user && currentUser.profile) ? <Outlet/> : <Navigate to="/auth/signin" />;
};

export default AuthProtectedRoute;