import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../store/authSlice";

export const AuthRedirectRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/users" />;
  }

  return children;
};

export default AuthRedirectRoute;